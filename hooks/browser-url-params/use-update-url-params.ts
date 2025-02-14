import { useSearchParams, useRouter } from 'next/navigation';

export const useUpdateUrlParams = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // This function appends, updates, or deletes filters without replacing everything.
  const updateUrlParams = <T extends Record<string, any>>(newFilters?: T) => {
    if (!newFilters) return;

    const params = new URLSearchParams(searchParams);

    Object.entries(newFilters).forEach(([key, value]) => {
      // if (value !== null && value !== undefined) { // Allow 0, false, etc.
      if (value || value === false || value === 0) {
        if (Array.isArray(value)) { // For multi select filters like calltypes
          if (value.length === 0) {
            params.delete(key);
            return; // Skip further processing for this key
          }

          // Remove empty strings and join with comma
          value = value.filter((v) => v.trim() !== '').join(',');
        }

        const currentValue = params.get(key);
        if (currentValue !== value) {
          params.set(key, value);
        }
      } else {
        params.delete(key);
      }
    });

    // Only update the URL if something has changed
    const newUrl = `?${params.toString()}`;
    if (newUrl !== `?${searchParams.toString()}`) {
      router.replace(newUrl);
    }
  };

  // Function to reset all filters (clear query params)
  const resetUrlParams = () => {
    router.replace('?'); // Clear all query parameters
  };

  // TODO: USELESS, NOT UPDATING THE URL
  // Use reset instead
  const deleteUrlParam = (param: string) => {
    // Fetch the current URL
    const url = new URL(window.location.href);

    // Get the query parameters from the URL
    const params = new URLSearchParams(url.search);

    // Delete the given query parameter
    params.delete(param);

    // Update the browser's URL with the new query parameters
    window.history.replaceState(
      null,
      '',
      `${url.pathname}?${params.toString()}`
    );
  };

  // const deleteUrlParam = (key: string) => {
  //   const params = new URLSearchParams(searchParams);

  //   // Delete the parameter
  //   params.delete(key);

  //   // Update the URL with shallow routing
  //   const updatedParams = params.toString() ? `?${params.toString()}` : ""
  //   router.replace(updatedParams);
  // };

  return { updateUrlParams, resetUrlParams, deleteUrlParam };
};
