import { IBudget } from '@/api/models/user';
import React, { useState } from 'react';
import styled from 'styled-components';
import CreateBugetForm from './CreateBugetForm';
import SplitBugetForm from './SplitBugetForm';

interface Props {
  username: string;
}

const Onboarding: React.FC<Props> = ({ username }) => {
  const [step, setStep] = useState(1);
  const [budget, setBudget] = useState<IBudget>();

  const handleNext = (budget: IBudget) => {
    setStep((prevStep) => prevStep + 1);
    setBudget(budget);
  };

  const renderForm = () => {
    if (step === 1) return <CreateBugetForm username={username} onNextStep={handleNext} />;
    if (step === 2 && budget) return <SplitBugetForm budget={budget} />;

    return null;
  }

  return renderForm();
};

export default Onboarding;
