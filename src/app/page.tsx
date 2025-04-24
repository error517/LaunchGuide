'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {marketingChannels} from '@/lib/constants';
import {generateMarketingPlan} from '@/ai/flows/generate-marketing-plan';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Slider} from '@/components/ui/slider';
import {Textarea} from '@/components/ui/textarea';
import {Checkbox} from '@/components/ui/checkbox';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {useToast} from '@/hooks/use-toast';

export default function Home() {
  const [productOverview, setProductOverview] = useState('');
  const [coreValueProposition, setCoreValueProposition] = useState('');
  const [targetAudienceType, setTargetAudienceType] = useState<'Consumers' | 'Business' | 'Government'>('Consumers');
  const [consumerTargetAudience, setConsumerTargetAudience] = useState('');
  const [businessTargetAudience, setBusinessTargetAudience] = useState('');
  const [governmentTargetAudience, setGovernmentTargetAudience] = useState('');
  const [currentAwareness, setCurrentAwareness] = useState('Just an idea');
  const [goal, setGoal] = useState('Awareness');
  const [budget, setBudget] = useState([500]);
  const [strengthsToLeverage, setStrengthsToLeverage] = useState('');
  const [majorConstraints, setMajorConstraints] = useState('');
  const [preferredChannels, setPreferredChannels] = useState<string[]>([]);
  const [otherChannel, setOtherChannel] = useState('');
  const [toneAndBrandPersonality, setToneAndBrandPersonality] = useState('');
  const [email, setEmail] = useState('');

  const [planSteps, setPlanSteps] = useState<string[]>([]);
  const {toast} = useToast();

  const router = useRouter();

  const handleChannelSelect = (channelName: string) => {
    setPreferredChannels(prev => {
      if (prev.includes(channelName)) {
        return prev.filter(name => name !== channelName);
      } else {
        return [...prev, channelName];
      }
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: 'Error',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
      return;
    }

    const onboardingData = {
      productOverview,
      coreValueProposition,
      targetAudience:
        targetAudienceType === 'Consumers'
          ? consumerTargetAudience
          : targetAudienceType === 'Business'
            ? businessTargetAudience
            : governmentTargetAudience,
      currentAwareness,
      goal,
      budget: budget[0],
      strengthsToLeverage,
      majorConstraints,
      preferredChannels: preferredChannels.concat(otherChannel ? [otherChannel] : []),
      toneAndBrandPersonality,
      email,
    };

    // In a real application, you would send this data to your server
    // and handle saving it to a database.
    console.log('Onboarding Data:', onboardingData);

    // Generate marketing plan (currently disabled for single page)
    /*
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
    */

    // For now, let's just navigate to the plan display page
    router.push('/plan-display');
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-2 bg-background">
      <h1 className="text-2xl font-bold mb-4">
        BLASTari Market Plan Prompt Builder
      </h1>
      <p className="text-lg mb-8">
        (All fields optional, but the more you complete, the better the result)
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-3xl">
        <div className="mb-4">
          <Label htmlFor="productOverview" className="block text-sm font-medium text-foreground">
            1. Product Overview (What is it?)
          </Label>
          <Textarea
            id="productOverview"
            className="shadow-sm bg-input border border-input text-foreground text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
            value={productOverview}
            onChange={e => setProductOverview(e.target.value)}
            placeholder="Briefly describe your product or service in 1–2 sentences."
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="coreValueProposition" className="block text-sm font-medium text-foreground">
            2. Core Value Proposition (Why will people care?)
          </Label>
          <Textarea
            id="coreValueProposition"
            className="shadow-sm bg-input border border-input text-foreground text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
            value={coreValueProposition}
            onChange={e => setCoreValueProposition(e.target.value)}
            placeholder="What’s the most unique, urgent, or emotionally resonant benefit of this product?"
          />
        </div>

        <div className="mb-4">
          <Label className="block text-sm font-medium text-foreground">
            3. Target Audience
          </Label>
          <RadioGroup
            defaultValue="Consumers"
            className="flex gap-2"
            onValueChange={value => setTargetAudienceType(value as 'Consumers' | 'Business' | 'Government')}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Consumers" id="target-consumers" />
              <Label htmlFor="target-consumers">Consumers</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Business" id="target-business" />
              <Label htmlFor="target-business">Business</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Government" id="target-government" />
              <Label htmlFor="target-government">Government</Label>
            </div>
          </RadioGroup>

          {targetAudienceType === 'Consumers' && (
            <div className="mt-2">
              <Textarea
                placeholder="Who is the ideal user? (Demographics, psychographics, interests, behavior patterns)"
                value={consumerTargetAudience}
                onChange={e => setConsumerTargetAudience(e.target.value)}
                className="shadow-sm bg-input border border-input text-foreground text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
              />
            </div>
          )}

          {targetAudienceType === 'Business' && (
            <div className="mt-2">
              <Textarea
                placeholder="Industry"
                value={businessTargetAudience}
                onChange={e => setBusinessTargetAudience(e.target.value)}
                className="shadow-sm bg-input border border-input text-foreground text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
              />
            </div>
          )}

          {targetAudienceType === 'Government' && (
            <div className="mt-2">
              <Textarea
                placeholder="Sector"
                value={governmentTargetAudience}
                onChange={e => setGovernmentTargetAudience(e.target.value)}
                className="shadow-sm bg-input border border-input text-foreground text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
              />
            </div>
          )}
        </div>

        <div className="mb-4">
          <Label htmlFor="currentAwareness" className="block text-sm font-medium text-foreground">
            4. Current Awareness/Validation
          </Label>
          <Select onValueChange={value => setCurrentAwareness(value)}>
            <SelectTrigger className="shadow-sm bg-input border border-input text-foreground text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5">
              <SelectValue placeholder={currentAwareness} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Just an idea">Just an idea</SelectItem>
              <SelectItem value="MVP live">MVP live</SelectItem>
              <SelectItem value="Some beta users">Some beta users</SelectItem>
              <SelectItem value="Public launch">Public launch</SelectItem>
              <SelectItem value="Revenue generating">Revenue generating</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4">
          <Label htmlFor="goal" className="block text-sm font-medium text-foreground">
            5. Goal
          </Label>
          <Select onValueChange={value => setGoal(value)}>
            <SelectTrigger className="shadow-sm bg-input border border-input text-foreground text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5">
              <SelectValue placeholder={goal} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Awareness">Awareness</SelectItem>
              <SelectItem value="Waitlist signups">Waitlist signups</SelectItem>
              <SelectItem value="App downloads">App downloads</SelectItem>
              <SelectItem value="Purchases/Users">Purchases/Users</SelectItem>
              <SelectItem value="Feedback/Validation">Feedback/Validation</SelectItem>
              <SelectItem value="Brand credibility">Brand credibility</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4">
          <Label htmlFor="budget" className="block text-sm font-medium text-foreground">
            6. Budget
          </Label>
          <Slider
            id="budget"
            defaultValue={budget}
            max={10000}
            step={100}
            onValueChange={value => setBudget(value)}
          />
          <div className="text-sm text-muted-foreground">
            ${budget[0]}
          </div>
        </div>

        <div className="mb-4">
          <Label htmlFor="strengthsToLeverage" className="block text-sm font-medium text-foreground">
            7. Strengths to Leverage
          </Label>
          <Textarea
            id="strengthsToLeverage"
            className="shadow-sm bg-input border border-input text-foreground text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
            value={strengthsToLeverage}
            onChange={e => setStrengthsToLeverage(e.target.value)}
            placeholder="What advantages or assets do you already have?"
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="majorConstraints" className="block text-sm font-medium text-foreground">
            8. Major Constraints or Risks
          </Label>
          <Textarea
            id="majorConstraints"
            className="shadow-sm bg-input border border-input text-foreground text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
            value={majorConstraints}
            onChange={e => setMajorConstraints(e.target.value)}
            placeholder="Any limitations in time, money, team, legal, or platform?"
          />
        </div>

        <div className="mb-4">
          <Label className="block text-sm font-medium text-foreground">
            9. Preferred Channel Types (Optional)
          </Label>
          {marketingChannels.map(channel => (
            <div key={channel.name} className="mb-2">
              <label className="flex items-center">
                <Checkbox
                  className="mr-2 h-5 w-5 text-primary focus:ring-primary rounded"
                  value={channel.name}
                  checked={preferredChannels.includes(channel.name)}
                  onCheckedChange={checked => {
                    if (checked) {
                      setPreferredChannels([...preferredChannels, channel.name]);
                    } else {
                      setPreferredChannels(preferredChannels.filter(name => name !== channel.name));
                    }
                  }}
                />
                <span>
                  {channel.name} - {channel.description}
                </span>
              </label>
            </div>
          ))}
          <Input
            type="text"
            placeholder="Other"
            value={otherChannel}
            onChange={e => setOtherChannel(e.target.value)}
            className="shadow-sm bg-input border border-input text-foreground text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="toneAndBrandPersonality" className="block text-sm font-medium text-foreground">
            10. Tone &amp; Brand Personality
          </Label>
          <Textarea
            id="toneAndBrandPersonality"
            className="shadow-sm bg-input border border-input text-foreground text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
            value={toneAndBrandPersonality}
            onChange={e => setToneAndBrandPersonality(e.target.value)}
            placeholder="How should the brand feel in marketing materials?"
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="email" className="block text-sm font-medium text-foreground">
            11. Email (required)
          </Label>
          <Input
            type="email"
            id="email"
            className="shadow-sm bg-input border border-input text-foreground text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Where should contact you to send recommendations?"
            required
          />
        </div>

        <Button
          type="submit"
          className="bg-primary text-primary-foreground hover:bg-primary/80 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          Generate Plan
        </Button>
      </form>
    </div>
  );
}
