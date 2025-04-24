'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {marketingChannels} from '@/lib/constants';
import {generateMarketingPlan} from '@/ai/flows/generate-marketing-plan';

export default function Home() {
  const [productDescription, setProductDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [businessGoal, setBusinessGoal] = useState('first 10 paying customers');
  const [budgetConstraints, setBudgetConstraints] = useState('<$500/month');
  const [marketingKnowledge, setMarketingKnowledge] = useState('beginner');
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);

  const [planSteps, setPlanSteps] = useState<string[]>([]);

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

    const onboardingData = {
      productDescription,
      targetAudience,
      businessGoal,
      budgetConstraints,
      marketingKnowledge,
    };

    // In a real application, you would send this data to your server
    // and handle saving it to a database.
    console.log('Onboarding Data:', onboardingData);
    console.log('Selected Channels:', selectedChannels);

    if (selectedChannels.length === 0) {
      alert('Please select at least one channel.');
      return;
    }

    // Generate marketing plan for each selected channel
    const plans = await Promise.all(
      selectedChannels.map(async channel => {
        const input = {
          ...onboardingData,
          channel,
        };
        try {
          const result = await generateMarketingPlan(input);
          return {channel, planSteps: result.planSteps};
        } catch (error) {
          console.error(`Error generating plan for ${channel}:`, error);
          return {channel, planSteps: ['Failed to generate plan.']};
        }
      })
    );

    // Aggregate plan steps
    let allSteps: string[] = [];
    plans.forEach(plan => {
      allSteps = allSteps.concat([`## ${plan.channel}`]).concat(plan.planSteps);
    });
    setPlanSteps(allSteps);

    // For now, let's just navigate to the plan display page
    router.push('/plan-display');
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-2 bg-background">
      <h1 className="text-2xl font-bold mb-4">
        Tell us about your business
      </h1>
      <form onSubmit={handleSubmit} className="w-full max-w-lg">
        <div className="mb-4">
          <label
            htmlFor="productDescription"
            className="block text-sm font-medium text-foreground"
          >
            Product/Service Description
          </label>
          <textarea
            id="productDescription"
            className="shadow-sm bg-input border border-input text-foreground text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
            value={productDescription}
            onChange={e => setProductDescription(e.target.value)}
            placeholder="Describe your product or service"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="targetAudience"
            className="block text-sm font-medium text-foreground"
          >
            Target Audience
          </label>
          <input
            type="text"
            id="targetAudience"
            className="shadow-sm bg-input border border-input text-foreground text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
            value={targetAudience}
            onChange={e => setTargetAudience(e.target.value)}
            placeholder="Describe your target audience"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="businessGoal"
            className="block text-sm font-medium text-foreground"
          >
            Primary Initial Business Goal
          </label>
          <select
            id="businessGoal"
            className="shadow-sm bg-input border border-input text-foreground text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
            value={businessGoal}
            onChange={e => setBusinessGoal(e.target.value)}
          >
            <option value="first 10 paying customers">
              First 10 Paying Customers
            </option>
            <option value="100 beta users">100 Beta Users</option>
            <option value="validate problem">Validate Problem</option>
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="budgetConstraints"
            className="block text-sm font-medium text-foreground"
          >
            Budget Constraints
          </label>
          <select
            id="budgetConstraints"
            className="shadow-sm bg-input border border-input text-foreground text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
            value={budgetConstraints}
            onChange={e => setBudgetConstraints(e.target.value)}
          >
            <option value="<$500/month">Less than $500/month</option>
            <option value="time-only">Time-only</option>
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="marketingKnowledge"
            className="block text-sm font-medium text-foreground"
          >
            Self-Assessment of Marketing Knowledge
          </label>
          <select
            id="marketingKnowledge"
            className="shadow-sm bg-input border border-input text-foreground text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
            value={marketingKnowledge}
            onChange={e => setMarketingKnowledge(e.target.value)}
          >
            <option value="beginner">Beginner</option>
            <option value="some familiarity">Some Familiarity</option>
          </select>
        </div>

        <h2 className="text-xl font-bold mb-4">Select Your Channels</h2>
        <p className="text-lg mb-8">
          Choose channels you think are potentially viable for your business.
        </p>

        {marketingChannels.map(channel => (
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
        >
          Generate Plan
        </button>
      </form>
    </div>
  );
}
