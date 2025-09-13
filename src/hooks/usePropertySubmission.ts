import { useState } from "react";
import { createListing, updateListing } from "@/services/propertyService";

export function usePropertySubmission(initialData?: any) {
  const [form, setForm] = useState(initialData || {});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Update form state
  const handleChange = (field: string, value: any) => {
    setForm((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Create new listing
  const submitProperty = async (data: any) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await createListing(data);
      setSuccess(true);
      return true;
    } catch (err: any) {
      console.error("Error creating listing:", err);
      setError(err.message || "Failed to create property.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Edit existing listing
  const editProperty = async (id: string, data: any) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await updateListing(id, data);
      setSuccess(true);
      return true;
    } catch (err: any) {
      console.error("Error updating listing:", err);
      setError(err.message || "Failed to update property.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    setForm,
    handleChange,
    submitProperty,
    editProperty,
    loading,
    error,
    success,
  };
}
