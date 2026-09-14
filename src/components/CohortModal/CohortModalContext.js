import React, { createContext, useState, useCallback } from 'react';

export const CohortModalContext = createContext();

export const CohortModalProvider = ({ children }) => {
  const [showCohortModal, setShowCohortModal] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [currentCohortChanges, setCurrentCohortChanges] = useState(null);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [selectedCohort, setSelectedCohort] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmModalProps, setConfirmModalProps] = useState({
    handleConfirm: () => { },
    deletionType: "",
  });
  /**
   * Draft cohort opened from Cohort Analyzer “CREATE NEW COHORT”.
   * Not written to cohort state / localStorage until the user clicks Save Changes.
   */
  const [pendingNewCohort, setPendingNewCohort] = useState(null);

  const showAlert = useCallback((type, message, duration = 2500) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert({ type: '', message: '' });
    }, duration);
  }, []);

  const clearAlert = useCallback(() => {
    setAlert({ type: '', message: '' });
  }, []);

  const clearCurrentCohortChanges = useCallback(() => {
    setCurrentCohortChanges(null);
  }, []);

  const clearPendingNewCohort = useCallback(() => {
    setPendingNewCohort(null);
  }, []);

  const contextValue = {
    showCohortModal,
    setShowCohortModal,
    warningMessage,
    setWarningMessage,
    currentCohortChanges,
    setCurrentCohortChanges,
    alert,
    showAlert,
    clearAlert,
    selectedCohort,
    setSelectedCohort,
    clearCurrentCohortChanges,
    showConfirmation,
    setShowConfirmation,
    confirmModalProps,
    setConfirmModalProps,
    pendingNewCohort,
    setPendingNewCohort,
    clearPendingNewCohort,
  };

  return (
    <CohortModalContext.Provider value={contextValue}>
      {children}
    </CohortModalContext.Provider>
  );
};
