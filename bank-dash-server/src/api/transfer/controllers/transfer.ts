export default {
  async create(ctx) {
    const body = ctx.request.body;
    const data = body?.data || body;

    const { senderClerkId, recipientClerkId, amount, senderName, recipientName } = data;

    if (!senderClerkId || !recipientClerkId || !amount || !senderName || !recipientName) {
      return ctx.badRequest('Missing required fields');
    }

    try {
      const result = await strapi.service('api::transfer.transfer').transfer({
        senderClerkId,
        recipientClerkId,
        amount: Number(amount),
        senderName,
        recipientName,
      });

      ctx.body = { data: result };
    } catch (error) {
      strapi.log.error('[Transfer] Unexpected error:', error);
      ctx.body = {
        data: { success: false, error: 'Transaction failed' },
      };
    }
  },
};
