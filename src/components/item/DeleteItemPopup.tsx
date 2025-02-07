import React from "react";
import Button from "@/src/components/ui/button";

interface DeleteItemPopupProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  itemID: number;
  onDeleteSuccess: (deletedItemID: number) => void;
}

const DeleteItemPopup: React.FC<DeleteItemPopupProps> = ({
  isOpen,
  onClose,
  itemName,
  itemID,
  onDeleteSuccess,
}) => {
  if (!isOpen) return null;

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/deleteItem/${itemID}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onDeleteSuccess(itemID);
        onClose();
      } else {
        console.error("Failed to delete the item");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="backdrop-blur-md rounded-lg shadow-lg w-auto h-auto m-60 text-white/80 p-4">
        <h2 className="text-xl font-bold mb-4 text-center">
          You sure you wanna delete the {itemName} item? {itemID}
        </h2>
        <div className="flex justify-around mt-8 gap-2">
          <Button
            variant="outline"
            className="border-green-500 text-white hover:bg-green-500 !px-20"
            onClick={onClose}
            type="button"
          >
            No
          </Button>
          <Button
            variant="default"
            className="bg-red-500 text-white hover:bg-red-600 hover:text-white/80 !px-20"
            onClick={handleDelete}
            type="button"
          >
            Yes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteItemPopup;
