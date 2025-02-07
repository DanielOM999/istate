"use client";

import { useEffect, useState } from "react";
import { IoIosRadioButtonOn } from "react-icons/io";
import Image from "next/image";
import Button from "@/src/components/ui/button";
import AddItemPopup from "./AddItemPopup";
import EditItemPopup from "./EditItemPopup";
import DeleteItemPopup from "./DeleteItemPopup";

function ItemShowComponent() {
  const [items, setItems] = useState<any[]>([]);
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [selectedItemName, setSelectedItemName] = useState<string>("");
  const [selectedItemID, setSelectedItemID] = useState<number | undefined>();
  const [selectedItemImage, setSelectedItemImage] = useState<string>("");
  const [selectedItemDescription, setSelectedItemDescription] = useState<string>("");
  const [selectedTotalItems, setSelectedTotalItems] = useState<number>(0);
  const [selectedStorageQuantity, setSelectedStorageQuantity] = useState<number>(0);
  const [selectedLentOutCount, setSelectedLentOutCount] = useState<number>(0);
  const [selectedMissingCount, setSelectedMissingCount] = useState<number>(0);

  useEffect(() => {
    async function fetchPosts() {
      const response = await fetch("/api/IS");
      const data = await response.json();
      setItems(data);
    }
    fetchPosts();
  }, []);

  const handleEditClick = (item: any) => {
    setSelectedItemName(item.item_name);
    setSelectedItemID(item.id);
    setSelectedItemImage(item.item_image);
    setSelectedItemDescription(item.item_description);
    setSelectedTotalItems(item.total_items);
    setSelectedStorageQuantity(item.storage_quantity);
    setSelectedLentOutCount(item.lent_out_count);
    setSelectedMissingCount(item.missing_count);
    setIsEditPopupOpen(true);
  };

  const handleDeleteClick = (itemName: string, itemID: number) => {
    setSelectedItemName(itemName);
    setSelectedItemID(itemID);
    setIsDeletePopupOpen(true);
  };

  const handleDeleteSuccess = (deletedItemID: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== deletedItemID));
    setIsDeletePopupOpen(false);
  };

  const handleAddItem = (newItem: any) => {
    setItems((prevItems) => [...prevItems, newItem]);
  };

  const handleUpdatedItem = (updatedItem: any) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === selectedItemID 
          ? { ...item, ...updatedItem }
          : item
      )
    );
  };

  return (
    <div className="p-10">
      <div className="flex items-center justify-between border-b border-white/10">
        <h1 className="text-white text-2xl pb-2 mb-2">Items registered</h1>
        <Button
          variant="outline"
          className="border-gray-500 mb-4 text-white hover:bg-gray-500 hover:text-black"
          onClick={() => setIsAddPopupOpen(true)}
        >
          Add
        </Button>
      </div>
      <ul className="divide-y-2 divide-white/10">
        {items.map((item) => (
          <li key={item.id} className="py-3 sm:pb-4 relative group">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="shrink-0">
                {item.item_image ? (
                  <Image
                    src={item.item_image}
                    width={32}
                    height={32}
                    layout="intrinsic"
                    className="rounded-full"
                    alt={`Image of ${item.item_name}`}
                  />
                ) : (
                  <IoIosRadioButtonOn className="w-8 h-8 rounded-full text-white" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                  {item.item_name}
                </p>
                <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                  {item.item_description ? item.item_description : null}
                </p>
              </div>
              {item.total_items < 0 ? (
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-950/45 text-white/75 text-sm font-medium shadow-md">
                  <span className="mr-1">You owe</span>
                  <span className="bg-red-950 text-white rounded-full px-2 py-0.5">
                    {item.total_items * -1}
                  </span>
                </div>
              ) : (
                <div className="flex items-center text-base font-semibold text-gray-900 dark:text-white ml-auto">
                  {item.total_items}
                </div>
              )}

              {item.storage_quantity ? (
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/45 text-white/75 text-sm font-medium shadow-md">
                  <span className="mr-1">In Storage</span>
                  <span className="bg-green-500 text-white rounded-full px-2 py-0.5">
                    {item.storage_quantity}
                  </span>
                </div>
              ) : null}

              {item.lent_out_count ? (
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-500/45 text-white/75 text-sm font-medium shadow-md">
                  <span className="mr-1">Lent out</span>
                  <span className="bg-yellow-500 text-white rounded-full px-2 py-0.5">
                    {item.lent_out_count}
                  </span>
                </div>
              ) : null}

              {item.missing_count ? (
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-500/45 text-white/75 text-sm font-medium shadow-md">
                  <span className="mr-1">Missing</span>
                  <span className="bg-red-500 text-white rounded-full px-2 py-0.5">
                    {item.missing_count}
                  </span>
                </div>
              ) : null}
              <div className="hidden group-hover:block opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button
                  variant="default"
                  className="bg-green-500 text-white hover:bg-green-600 hover:text-white/80 mr-2"
                  onClick={() => handleEditClick(item)}
                >
                  Edit
                </Button>
                <Button
                  variant="default"
                  className="bg-red-500 text-white hover:bg-red-600 hover:text-white/80"
                  onClick={() => handleDeleteClick(item.item_name, item.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <AddItemPopup isOpen={isAddPopupOpen} onClose={() => setIsAddPopupOpen(false)} onAddItem={handleAddItem} />
      <EditItemPopup 
        isOpen={isEditPopupOpen} 
        onClose={() => setIsEditPopupOpen(false)} 
        onUpdatedItem={handleUpdatedItem}
        itemName={selectedItemName} 
        itemID={selectedItemID!} 
        itemImage={selectedItemImage}
        itemDescription={selectedItemDescription}
        totalItems={selectedTotalItems}
        storageQuantity={selectedStorageQuantity}
        lentOutCount={selectedLentOutCount}
        missingCount={selectedMissingCount}
      />
      <DeleteItemPopup isOpen={isDeletePopupOpen} onClose={() => setIsDeletePopupOpen(false)} itemName={selectedItemName} itemID={selectedItemID!} onDeleteSuccess={handleDeleteSuccess} />
    </div>
  );
}

export default ItemShowComponent;
