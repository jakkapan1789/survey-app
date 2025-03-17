import React, { createContext, useContext, useState, useEffect } from "react";

const FormContext = createContext();

export const FormProvider = ({ children }) => {
  const [forms, setForms] = useState([]);
  const [responses, setResponses] = useState([]);

  const fetchInitialData = async () => {
    try {
      const formsResponse = await fetch("/api/forms");
      const formsData = await formsResponse.json();
      setForms(formsData);

      const responsesResponse = await fetch("/api/responses");
      const responsesData = await responsesResponse.json();
      setResponses(responsesData);
    } catch (error) {
      console.error("Failed to fetch initial data:", error);
    }
  };
  useEffect(async () => {
    await fetchInitialData();
  }, []);

  const createForm = async () => {
    const newForm = {
      id: `form-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: "แบบสอบถามใหม่",
      description: "คำอธิบายแบบสอบถาม",
      questions: [
        {
          id: `q-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          type: "text",
          title: "คำถามใหม่",
          required: false,
          order: 0,
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      published: false,
    };

    try {
      console.log("Creating form:", newForm);
      const response = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newForm),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create form");
      }

      const createdForm = await response.json();
      setForms((prevForms) => [...prevForms, createdForm]);
      return createdForm.id;
    } catch (error) {
      console.error("Error creating form:", error);
      return null;
    }
  };

  const updateForm = async (form) => {
    try {
      console.log("Updating form:", form);
      const response = await fetch(`/api/forms/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update form");
      }

      const updatedForm = await response.json();
      setForms((prevForms) =>
        prevForms.map((f) => (f.id === updatedForm.id ? updatedForm : f))
      );
    } catch (error) {
      console.error("Error updating form:", error);
    }
  };

  const deleteForm = async (formId) => {
    try {
      console.log("Deleting form:", formId);
      const response = await fetch(`/api/forms/${formId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete form");
      }

      setForms((prevForms) => prevForms.filter((f) => f.id !== formId));
    } catch (error) {
      console.error("Error deleting form:", error);
    }
  };

  const getForm = async (formId) => {
    try {
      console.log("Fetching form from DB:", formId);
      const response = await fetch(`/api/forms/${formId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Form not found");
      }

      const formData = await response.json();
      setForms((prevForms) => {
        const exists = prevForms.some((f) => f.id === formId);
        if (exists) {
          return prevForms.map((f) => (f.id === formId ? formData : f));
        }
        return [...prevForms, formData];
      });
      return formData;
    } catch (error) {
      console.error("Error fetching form:", error);
      return null;
    }
  };

  const publishForm = async (formId) => {
    try {
      console.log("Publishing form:", formId);
      const response = await fetch(`/api/forms/${formId}/publish`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: true }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to publish form");
      }

      const updatedForm = await response.json();
      setForms((prevForms) =>
        prevForms.map((f) => (f.id === formId ? updatedForm : f))
      );
    } catch (error) {
      console.error("Error publishing form:", error);
    } finally {
      await fetchInitialData();
    }
  };

  const unpublishForm = async (formId) => {
    try {
      console.log("Unpublishing form:", formId);
      const response = await fetch(`/api/forms/${formId}/publish`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: false }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to unpublish form");
      }

      const updatedForm = await response.json();
      setForms((prevForms) =>
        prevForms.map((f) => (f.id === formId ? updatedForm : f))
      );
    } catch (error) {
      console.error("Error unpublishing form:", error);
    } finally {
      await fetchInitialData();
    }
  };

  const submitResponse = async (formResponse) => {
    const newResponse = {
      id: `response-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: Date.now(),
      ...formResponse,
    };

    try {
      console.log("Submitting response:", newResponse);
      const response = await fetch("/api/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newResponse),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit response");
      }

      const createdResponse = await response.json();
      setResponses((prevResponses) => [...prevResponses, createdResponse]);
    } catch (error) {
      console.error("Error submitting response:", error);
    }
  };

  const getFormResponses = async (formId) => {
    try {
      console.log("Fetching responses from DB for form:", formId);
      const response = await fetch(`/api/responses?formId=${formId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch responses");
      }

      const responsesData = await response.json();
      setResponses((prevResponses) => {
        const updatedResponses = [...prevResponses];
        responsesData.forEach((newResponse) => {
          const index = updatedResponses.findIndex(
            (r) => r.id === newResponse.id
          );
          if (index >= 0) {
            updatedResponses[index] = newResponse;
          } else {
            updatedResponses.push(newResponse);
          }
        });
        return updatedResponses;
      });
      return responsesData;
    } catch (error) {
      console.error("Error fetching responses:", error);
      return [];
    }
  };

  return (
    <FormContext.Provider
      value={{
        forms,
        responses,
        createForm,
        updateForm,
        deleteForm,
        getForm,
        publishForm,
        unpublishForm,
        submitResponse,
        getFormResponses,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};
