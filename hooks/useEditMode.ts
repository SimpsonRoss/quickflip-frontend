import { ScannedItem } from '@/store';
import { useEffect, useState } from 'react';

export function useEditMode(items: ScannedItem[]) {
  const [editMode, setEditMode] = useState(false);
  const [localValues, setLocalValues] = useState<{
    [id: string]: { 
      pricePaid?: string; 
      priceSold?: string; 
      estimatedPrice?: string; 
    };
  }>({});

  // Initialize local values when entering edit mode
  useEffect(() => {
    if (editMode) {
      const initialValues: typeof localValues = {};
      items.forEach((item) => {
        initialValues[item.id] = {
          pricePaid: item.pricePaid?.toFixed(2) ?? '',
          priceSold: item.priceSold?.toFixed(2) ?? '',
          estimatedPrice: item.estimatedPrice?.toFixed(2) ?? '',
        };
      });
      setLocalValues(initialValues);
    }
  }, [editMode, items]);

  const updateLocalValue = (id: string, field: string, value: string) => {
    setLocalValues((prev) => ({
      ...prev,
      [id]: { 
        ...prev[id], 
        [field]: value 
      },
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
}