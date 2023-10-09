import {
  Box,
  Input,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap
} from "@chakra-ui/react";
import { useState, useEffect } from "react";

const EMAIL_REGEXP = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isValidEmail = (email) => EMAIL_REGEXP.test(email);

/**
 * Represents an email added to the list. Highlighted with a close button for removal.
 */
export const Chip = ({ email, onCloseClick }) => (
  <Tag key={email} borderRadius="full" variant="solid" colorScheme="green">
    <TagLabel>{email}</TagLabel>
    <TagCloseButton
      onClick={() => {
        onCloseClick(email);
      }}
    />
  </Tag>
);

/**
 * A horizontal stack of chips. Like a Pringles can on its side.
 */
export const ChipList = ({ emails = [], onCloseClick }) => (
  <Wrap spacing={1} mb={3}>
    {emails.map((email) => (
      <Chip email={email} key={email} onCloseClick={onCloseClick} />
    ))}
  </Wrap>
);

/**
 * Form field wrapper.
 */
export const ChipEmailInput = ({ ...rest }) => (
  <Box>
    <Input type="email" {...rest} />
  </Box>
);

/**
 * Contains presentation, logic and state for inputting emails and having them saved as chips.
 */
export const EmailChipInput = ({ initialEmails = [], triggerEmailReset, triggerEmailAdd, setOptionalPartnerEmails }) => {


  useEffect(() => {
    if (triggerEmailAdd) {
      setEmails(triggerEmailAdd);
    }

  }, [triggerEmailAdd]);
  
  const [inputValue, setInputValue] = useState("");
  const [emails, setEmails] = useState(initialEmails);

  // Checks whether we've added this email already.
  const emailChipExists = (email) => emails.includes(email);

  // Add an email to the list, if it's valid and isn't already there.
  const addEmails = (emailsToAdd) => {
    const validatedEmails = emailsToAdd
      .map((e) => e.trim())
      .filter((email) => isValidEmail(email) && !emailChipExists(email));

    const newEmails = [...emails, ...validatedEmails];
    setEmails(newEmails);
    setOptionalPartnerEmails(newEmails);
    setInputValue("");
  };

  // Remove an email from the list.
  const removeEmail = (email) => {
    const index = emails.findIndex((e) => e === email);
    if (index !== -1) {
      const newEmails = [...emails];
      newEmails.splice(index, 1);
      setEmails(newEmails);
      setOptionalPartnerEmails(newEmails);
    }
  };

  // Save input field contents in state when changed.
  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  // Validate and add the email if we press tab, enter or comma.
  const handleKeyDown = (e) => {
    if (["Enter", "Tab", ","].includes(e.key)) {
      e.preventDefault();

      addEmails([inputValue]);
    }
  };

  // Split and add emails when pasting.
  const handlePaste = (e) => {
    e.preventDefault();

    const pastedData = e.clipboardData.getData("text");
    const pastedEmails = pastedData.split(",");
    addEmails(pastedEmails);
  };

  const handleCloseClick = (email) => {
    removeEmail(email);
  };

  return (
    <>


      <ChipEmailInput
        mb={2}
        placeholder="Ek bayi e-mail (opsiyonel)"
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        value={inputValue}
      />
      <ChipList emails={emails} onCloseClick={handleCloseClick} />
    </>
  );
};
