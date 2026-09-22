import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const testQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, 
    },
  },
});

const TestWrapper = ({ children }) => (
  <QueryClientProvider client={testQueryClient}>
    {children}
  </QueryClientProvider>
);

export { TestWrapper };