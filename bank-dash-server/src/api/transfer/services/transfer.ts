import crypto from "crypto";

interface TransferParams {
  senderClerkId: string;
  recipientClerkId: string;
  amount: number;
  senderName: string;
  recipientName: string;
}

interface TransferResult {
  success: boolean;
  error: string | null;
}

export default ({ strapi }) => ({
  async transfer(params: TransferParams): Promise<TransferResult> {
    const {
      senderClerkId,
      recipientClerkId,
      amount,
      senderName,
      recipientName,
    } = params;

    if (amount <= 0) {
      return { success: false, error: "Please enter a valid amount" };
    }

    const knex = strapi.db.connection;

    return knex.transaction(async (trx) => {
      // Find sender's active, published cards
      const senderCards = await trx("cards")
        .join("cards_member_lnk", "cards.id", "cards_member_lnk.card_id")
        .join("members", "members.id", "cards_member_lnk.member_id")
        .where("members.clerk_id", senderClerkId)
        .andWhere("cards.is_active", 1)
        .whereNotNull("cards.published_at")
        .select("cards.*");

      if (senderCards.length === 0) {
        return {
          success: false,
          error: "Unlock your card or create new to transfer",
        };
      }

      // Find a card with sufficient balance (integer-cent arithmetic)
      const amountCents = Math.round(amount * 100);
      const senderCard = senderCards.find(
        (card) => Math.round(card.balance * 100) >= amountCents,
      );

      if (!senderCard) {
        return { success: false, error: "Balance not enough" };
      }

      // Find recipient's active, published cards
      const recipientCards = await trx("cards")
        .join("cards_member_lnk", "cards.id", "cards_member_lnk.card_id")
        .join("members", "members.id", "cards_member_lnk.member_id")
        .where("members.clerk_id", recipientClerkId)
        .andWhere("cards.is_active", 1)
        .whereNotNull("cards.published_at")
        .select("cards.*");

      if (recipientCards.length === 0) {
        return {
          success: false,
          error: "Recipient has no active card to receive funds",
        };
      }

      const recipientCard = recipientCards[0];

      // Calculate new balances
      const senderNewBalance =
        (Math.round(senderCard.balance * 100) - amountCents) / 100;
      const recipientNewBalance =
        (Math.round(recipientCard.balance * 100) + amountCents) / 100;

      const today = new Date().toISOString().split("T")[0];
      const now = Date.now();

      // Get current max transaction_ord for each card
      const senderMaxOrd =
        (
          await trx("transactions_card_lnk")
            .where("card_id", senderCard.id)
            .max("transaction_ord as max_ord")
            .first()
        )?.max_ord || 0;

      const recipientMaxOrd =
        (
          await trx("transactions_card_lnk")
            .where("card_id", recipientCard.id)
            .max("transaction_ord as max_ord")
            .first()
        )?.max_ord || 0;

      // Create sender withdrawal transaction (draft + published)
      const senderTxDocId = crypto.randomUUID().replace(/-/g, "").slice(0, 24);

      // Draft row
      await trx("transactions").insert({
        document_id: senderTxDocId,
        message: `Transfer to ${recipientName}`,
        amount,
        type: "withdrawal",
        date: today,
        published_at: null,
        created_at: now,
        updated_at: now,
        locale: null,
      });

      // Published row
      await trx("transactions").insert({
        document_id: senderTxDocId,
        message: `Transfer to ${recipientName}`,
        amount,
        type: "withdrawal",
        date: today,
        published_at: now,
        created_at: now,
        updated_at: now,
        locale: null,
      });

      const senderTxPublishedId = (
        await trx("transactions").max("id as id").first()
      ).id;

      // Link published sender transaction to sender card
      await trx("transactions_card_lnk").insert({
        transaction_id: senderTxPublishedId,
        card_id: senderCard.id,
        transaction_ord: senderMaxOrd + 1,
      });

      // Create recipient deposit transaction (draft + published)
      const recipientTxDocId = crypto
        .randomUUID()
        .replace(/-/g, "")
        .slice(0, 24);

      // Draft row
      await trx("transactions").insert({
        document_id: recipientTxDocId,
        message: `Receive from ${senderName}`,
        amount,
        type: "deposit",
        date: today,
        published_at: null,
        created_at: now,
        updated_at: now,
        locale: null,
      });

      // Published row
      await trx("transactions").insert({
        document_id: recipientTxDocId,
        message: `Receive from ${senderName}`,
        amount,
        type: "deposit",
        date: today,
        published_at: now,
        created_at: now,
        updated_at: now,
        locale: null,
      });

      const recipientTxPublishedId = (
        await trx("transactions").max("id as id").first()
      ).id;

      // Link published recipient transaction to recipient card
      await trx("transactions_card_lnk").insert({
        transaction_id: recipientTxPublishedId,
        card_id: recipientCard.id,
        transaction_ord: recipientMaxOrd + 1,
      });

      // Update sender card balance
      await trx("cards")
        .where("id", senderCard.id)
        .update({ balance: senderNewBalance, updated_at: now });

      // Also update the draft row for the sender card
      await trx("cards")
        .where("document_id", senderCard.document_id)
        .update({ balance: senderNewBalance, updated_at: now });

      // Update recipient card balance
      await trx("cards")
        .where("id", recipientCard.id)
        .update({ balance: recipientNewBalance, updated_at: now });

      // Also update the draft row for the recipient card
      await trx("cards")
        .where("document_id", recipientCard.document_id)
        .update({ balance: recipientNewBalance, updated_at: now });

      return { success: true, error: null };
    });
  },
});
