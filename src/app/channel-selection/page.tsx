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

export default function ChannelSelection() {
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const router = useRouter();

  const handleChannelSelect = (channelName: string) => {
    setSelectedChannels(prev => {
      if (prev.includes(channelName)) {
        return prev.filter(name => name !== channelName);
      } else {
        return [...prev, channelName];
      }
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // In a real application, you would send this data to your server
    // and handle saving it to a database.
    console.log('Selected Channels:', selectedChannels);

    // For now, let's just navigate to the prioritization page
    router.push('/prioritization');
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-2 bg-background">
      <h1 className="text-2xl font-bold mb-4">Select Your Channels</h1>
      <p className="text-lg mb-8">
        Choose 3-5 channels you think are potentially viable for your business.
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-lg">
        {channels.map(channel => (
          <div key={channel.name} className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2 h-5 w-5 text-primary focus:ring-primary rounded"
                value={channel.name}
                checked={selectedChannels.includes(channel.name)}
                onChange={() => handleChannelSelect(channel.name)}
              />
              <span>
                {channel.name} - {channel.description}
              </span>
            </label>
          </div>
        ))}

        <button
          type="submit"
          className="bg-primary text-primary-foreground hover:bg-primary/80 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          disabled={selectedChannels.length < 3 || selectedChannels.length > 5}
        >
          Next: Prioritize Channels
        </button>
        {selectedChannels.length < 3 || selectedChannels.length > 5 ? (
          <p className="mt-2 text-sm text-muted-foreground">
            Please select between 3 and 5 channels.
          </p>
        ) : null}
      </form>
    </div>
  );
}
