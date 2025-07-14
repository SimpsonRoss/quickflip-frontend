export const withAsyncOperation = <T extends any[]>(
  set: (partial: { loading?: boolean; error?: string | null }) => void,
  operation: (...args: T) => Promise<void>,
  errorMessage: string
) => {
  return async (...args: T) => {
    try {
      set({ loading: true, error: null });
      await operation(...args);
      set({ loading: false });
    } catch (error) {
      console.error(errorMessage, error);
      set({
        error: error instanceof Error ? error.message : errorMessage,
        loading: false,
      });
    }
  };
};