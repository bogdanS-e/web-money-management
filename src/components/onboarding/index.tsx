import React, { useState } from 'react';
import styled from 'styled-components';
import CreateBugetForm from './CreateBugetForm';
import SplitBugetForm from './SplitBugetForm';

interface Props {
  username: string;
}

const Onboarding: React.FC<Props> = ({ username }) => {
  const [step, setStep] = useState(1);

  const handleNext = () => setStep((prevStep) => prevStep + 1);

  const renderForm = () => {
    if (step === 1) return <CreateBugetForm username={username} onNextStep={handleNext} />;
    if (step === 2) return <SplitBugetForm />;

    return null;
  }

  return renderForm();
};

export default Onboarding;
