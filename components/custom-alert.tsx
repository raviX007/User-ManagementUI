import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import React from "react";
const UserAlert: React.FC<{ message: string; isOpen: boolean }> = ({
  message,
  isOpen,
}) => {
  const [isAlertOpen, setIsAlertOpen] = React.useState(isOpen);

  const closeAlert = () => {
    setIsAlertOpen(false);
    window.location.reload();
  };

  return (
    <AlertDialog open={isAlertOpen} onOpenChange={closeAlert}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>ALERT!</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>OK</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default UserAlert;
