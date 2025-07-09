import { ScannedItem } from '@/store';
import { useEffect, useState } from 'react';

export type EditModeConfig = {
  pricePaid?: boolean;
  priceSold?: boolean;
  estimatedPrice?: boolean;
};

export const useEditMode = (items: ScannedItem[], config: EditModeConfig) => {
  const [editMode, setEditMode] = useState(false);
type LocalValues = {
  [id: string]: {
    pricePaid?: string;
    priceSold?: string;
    estimatedPrice?: string;
  };
};

  const [localValues, setLocalValues] = useState<LocalValues>({});

  // Initialize local values when entering edit mode
  useEffect(() => {
    if (editMode) {
      const initialValues: LocalValues = {};
      items.forEach((item) => {
        initialValues[item.id] = {};
        if (config.pricePaid) {
          initialValues[item.id].pricePaid = item.pricePaid?.toFixed(2) ?? "";
        }
        if (config.priceSold) {
          initialValues[item.id].priceSold = item.priceSold?.toFixed(2) ?? "";
        }
        if (config.estimatedPrice) {
          initialValues[item.id].estimatedPrice = item.estimatedPrice?.toFixed(2) ?? "";
        }
      });
      setLocalValues(initialValues);
    }
  }, [editMode, items, config]);

  const updateLocalValue = (id: string, field: string, value: string) => {
    setLocalValues((prev: LocalValues) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const exitEditMode = () => {
    setEditMode(false);
  };

  return {
    editMode,
    localValues,
    updateLocalValue,
    toggleEditMode,
    exitEditMode,
  };
};