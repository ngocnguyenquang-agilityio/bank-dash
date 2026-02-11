import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="p-8 rounded-2xl bg-background border border-border hover:border-blue-20 transition-all hover:shadow-lg group">
    <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-tx-primary mb-3">{title}</h3>
    <p className="text-muted-foreground leading-relaxed">{description}</p>
  </div>
);
