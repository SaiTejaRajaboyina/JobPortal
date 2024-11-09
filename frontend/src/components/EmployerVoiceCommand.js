import React, { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import { useNavigate } from 'react-router-dom';

const EmployerVoiceCommand = () => {
  const [listening, setListening] = useState(false);
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  const navigate = useNavigate();

  // Start voice recognition
  const startListening = () => {
    setListening(true);
    recognition.start();
  };

  // Stop voice recognition
  const stopListening = () => {
    setListening(false);
    recognition.stop();
  };

  // Define actions based on voice commands
  const handleCommand = (command) => {
    if (command.includes("employer home")) {
      navigate("/employer-home");
    } else if (command.includes("post jobs")) {
      navigate("/posting-jobs");
    } else if (command.includes("employer manage profile")) {
      navigate("/employer-manage-profile");
    }else if (command.includes("manage applications")) {
      navigate("/manage-applications");
    }else if (command.includes("employer skill assessment")) {
      navigate("/employer-skill-assessment");
    }else if (command.includes("employer learning resources")) {
      navigate("/employer-learning-resources");
    }else if (command.includes("get started")) {
      document.querySelector('[data-command="Get Started"]').click();
    }else if (command.includes("edit profile")) {
      document.querySelector('[data-command="Edit Profile"]').click();
    }else if (command.includes("view profile")) {
      document.querySelector('[data-command="View Profile"]').click();
    }else if (command.includes("top save")) {
      document.querySelector('[data-command="Top Save"]').click();
    }else if (command.includes("top edit")) {
      document.querySelector('[data-command="Top Edit"]').click();
    }else if (command.includes("bottom edit")) {
      document.querySelector('[data-command="Bottom Edit"]').click();
    }else if (command.includes("bottom save")) {
      document.querySelector('[data-command="Bottom Save"]').click();
    }else if (command.includes("manage questions")) {
      document.querySelector('[data-command="Manage Questions"]').click();
    }else if (command.includes("add question")) {
      document.querySelector('[data-command="Add Question"]').click();
    }else if (command.includes("add resource")) {
      document.querySelector('[data-command="Add Resource"]').click();
    }
    else if (command.includes("toggle")) {
      document.querySelector('[data-command="Toggle"]').click();
    }else if (command.includes("increase font size")) {
      document.querySelector('[data-command="Increase Font Size"]').click();
    }else if (command.includes("decrease font size")) {
      document.querySelector('[data-command="Decrease Font Size"]').click();
    } 


    // Add other commands as needed
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase();
    handleCommand(transcript);
  };

  recognition.onend = () => setListening(false);

  return (
    <Tooltip title="Voice Command">
      <IconButton onClick={listening ? stopListening : startListening} color={listening ? 'primary' : 'default'}>
        {listening ? <MicIcon /> : <MicOffIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default EmployerVoiceCommand;
