import { useCallback, useState } from 'react';

export const useKeyboardAwareCards = () => {
  const [focusedCardId, setFocusedCardId] = useState<string | null>(null);

  const handleCardFocus = useCallback((cardId: string) => {
    setFocusedCardId(cardId);
  }, []);

  const handleCardBlur = useCallback(() => {
    setFocusedCardId(null);
  }, []);

  const isCardFocused = useCallback((cardId: string) => {
    return focusedCardId === cardId;
  }, [focusedCardId]);

  return {
    focusedCardId,
    handleCardFocus,
    handleCardBlur,
    isCardFocused,
  };
};

export default useKeyboardAwareCards;