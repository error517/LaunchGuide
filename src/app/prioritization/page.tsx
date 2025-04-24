'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';

const channels = [
  {
    name: 'Content Marketing',
    description:
      'Creating and distributing valuable content to attract and engage your target audience.',
  },
  {
    name: 'SEO (Basic)',
    description:
      'Optimizing your website to rank higher in search engine results pages.',
  },
  {
    name: 'Community Building (Reddit/Indie Hackers)',
    description:
      'Engaging with online communities to build relationships and promote your product.',
  },
  {
    name: 'Cold Outreach (Limited)',
    description:
      'Reaching out to potential customers or partners directly.',
  },
  {
    name: 'BetaList/Product Hunt Launch',
    description: 'Launching your product on popular platforms to gain visibility.',
  },
  {
    name: 'Targeted Social Ads (Simple)',
    description: 'Running targeted advertising campaigns on social media.',
  },
];

export default function Prioritization() {
  const [prioritizedChannels, setPrioritizedChannels] = useState<string[]>([
    channels[0].name,
    channels[1].name,
  ]);
  const router = useRouter();

  const handlePriorityChange = (channelName: string, direction: 'up' | 'down') => {
    setPrioritizedChannels(prev => {
      const currentIndex = prev.indexOf(channelName);
      if (currentIndex === -1) return prev;

      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

      if (newIndex < 0 || newIndex >= prev.length) return prev;

      const updatedChannels = [...prev];
      updatedChannels[currentIndex] = prev[newIndex];
      updatedChannels[newIndex] = channelName;

      return updatedChannels;
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // In a real application, you would send this data to your server
    // and handle saving it to a database.
    console.log('Prioritized Channels:', prioritizedChannels);

    // For now, let's just navigate to the plan display page
    router.push('/plan-display');
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-2 bg-background">
      <h1 className="text-2xl font-bold mb-4">Prioritize Your Channels</h1>
      <p className="text-lg mb-8">
        Rank your selected channels based on potential reach, cost, and required
        skills.
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-lg">
        {channels.map(channel => (
          <div key={channel.name} className="mb-4">
            <div className="flex items-center justify-between">
              <span>{channel.name}</span>
              <div>
                <button
                  type="button"
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/80 font-medium rounded-lg text-sm px-2 py-1"
                  onClick={() => handlePriorityChange(channel.name, 'up')}
                >
                  Up
                </button>
                <button
                  type="button"
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/80 font-medium rounded-lg text-sm px-2 py-1 ml-2"
                  onClick={() => handlePriorityChange(channel.name, 'down')}
                >
                  Down
                </button>
              </div>
            </div>
          </div>
        ))}

        <button
          type="submit"
          className="bg-primary text-primary-foreground hover:bg-primary/80 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          Generate Plan
        </button>
      </form>
    </div>
  );
}
