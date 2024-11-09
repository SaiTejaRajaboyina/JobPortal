import React, { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import { useNavigate } from 'react-router-dom';

const VoiceCommand = () => {
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
    if (command.includes("home")) {
      navigate("/home");
    } else if (command.includes("search jobs")) {
      navigate("/search-jobs");
    } else if (command.includes("manage profile")) {
      navigate("/manage-profile");
    }else if (command.includes("skills assessment")) {
      navigate("/skills-assessments");
    }else if (command.includes("learning resources")) {
      navigate("/learning-resources");
    }else if (command.includes("get started")) {
      document.querySelector('[data-command="Get Started"]').click();
    }else if (command.includes("search")) {
      document.querySelector('[data-command="Search"]').click();
    }else if (command.includes("apply for the job")) {
      document.querySelector('[data-command="Apply for the Job"]').click();
    }else if (command.includes("edit profile")) {
      document.querySelector('[data-command="Edit Profile"]').click();
    }else if (command.includes("view profile")) {
      document.querySelector('[data-command="View Profile"]').click();
    }else if (command.includes("submit application")) {
      document.querySelector('[data-command="Submit Application"]').click();
    }else if (command.includes("back to search jobs")) {
      document.querySelector('[data-command="Back to Search Jobs"]').click();
    }else if (command.includes("top save")) {
      document.querySelector('[data-command="Top Save"]').click();
    }else if (command.includes("top edit")) {
      document.querySelector('[data-command="Top Edit"]').click();
    }else if (command.includes("bottom edit")) {
      document.querySelector('[data-command="Bottom Edit"]').click();
    }else if (command.includes("add")) {
      document.querySelector('[data-command="Add"]').click();
    }else if (command.includes("bottom save")) {
      document.querySelector('[data-command="Bottom Save"]').click();
    }else if (command.includes("start assessment")) {
      document.querySelector('[data-command="Start Assessment"]').click();
    }else if (command.includes("back to dashboard")) {
      document.querySelector('[data-command="Back to Dashboard"]').click();
    }else if (command.includes("toggle")) {
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

export default VoiceCommand;
