'use client';

import {useState, useEffect} from 'react';

export default function PlanDisplay() {
  const [plan, setPlan] = useState<string[]>([]);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([]);

  useEffect(() => {
    // Retrieve plan from local storage on component mount
    const storedPlan = localStorage.getItem('plan');
    if (storedPlan) {
      const parsedPlan = JSON.parse(storedPlan);
      setPlan(parsedPlan);
      setCompletedSteps(new Array(parsedPlan.length).fill(false)); // Initialize completedSteps
    }
  }, []);

  useEffect(() => {
    // Update completed steps when plan changes (e.g., after generation)
    setCompletedSteps(new Array(plan.length).fill(false));
  }, [plan]);

  const handleStepComplete = (index: number) => {
    setCompletedSteps(prev => {
      const updatedSteps = [...prev];
      updatedSteps[index] = !updatedSteps[index];
      return updatedSteps;
    });
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-2 bg-background">
      <h1 className="text-2xl font-bold mb-4">Your Marketing Plan</h1>
      <p className="text-lg mb-8">Follow these steps to get started:</p>

      <ul className="w-full max-w-lg">
        {plan.map((step, index) => (
          <li
            key={index}
            className="mb-4 flex items-center justify-between bg-card rounded-md shadow-sm p-4"
          >
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2 h-5 w-5 text-primary focus:ring-primary rounded"
                checked={completedSteps[index]}
                onChange={() => handleStepComplete(index)}
              />
              <span className={completedSteps[index] ? 'line-through' : ''}>
                {step}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
