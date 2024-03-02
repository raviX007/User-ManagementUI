"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import config from "@/app/config"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import UserAlert from "./custom-alert";

const AddUser: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(isOpen);
  const [formSubmitStatus, setFormSubmitStatus] = useState("");
  const [formSubmitMessage, setFormSubmitMessage] = useState("");
  const [saveToggle, setSaveToggle] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    hobbies: "",
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    hobbies:''

  });
  useEffect(() => {
    
    validateInput();
  }, [formData,saveToggle]);

  const closeAddDialog = () => {
    setIsAddDialogOpen(false);
    window.location.reload();
  };

  const submitForm = () => {
    
    setSaveToggle(prev=>!prev);
    if (Object.values(errors).every(error => error == '')) {
      const formURL = `${config.apiBaseUrl}`;

    fetch(formURL, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
    })
      .then((res) => {
       
        if (res.ok) {
          

          setFormSubmitStatus("OK");
          setFormSubmitMessage("User Added");
        } else {
          
          setFormSubmitStatus("FAILED");
          
          setFormSubmitMessage("Failed to Add User");
        }
      })
      .catch((err) => {
        
        setFormSubmitStatus("FAILED");
        setFormSubmitMessage("Failed to Add User");
      });
    }
    
  };
  const validateInput= ()=>{
    if (!formData.name || formData.name.length < 4) {
      errors.name = 'Name must be longer than 4*';
    }else{
      errors.name='';
    }

    if (formData.email == '') {
      errors.email = 'Email is required';
    }else{
      errors.email='';
    }
    if (formData.phoneNumber == '') {
      errors.phoneNumber = 'Phone Number is required';
    }else{
      errors.phoneNumber='';
    }
    if (formData.hobbies == '') {
      errors.hobbies = 'Hobbies is required';
    }else{
      errors.hobbies='';
    }
   
    setErrors(errors);
  }
  const handleInput = (e: any) => {
    
    const fieldName = e.target.name;
    const fieldValue = e.target.value;

    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: fieldValue,
    }));
    
   
  };

  return (
    <div>
      {formSubmitStatus !== "" ? (
        <div>
          {" "}
          <UserAlert isOpen={true} message={formSubmitMessage} />{" "}
        </div>
      ) : (
        <Dialog open={isAddDialogOpen} onOpenChange={closeAddDialog} >
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add User</DialogTitle>
              <DialogDescription>
                Add user details here. Click save when you are done.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name*
                </Label>
                <Input
                  name="name"
                  placeholder="Pankaj Dogra"
                  className="col-span-3"
                  onChange={e => {
                    handleInput(e)
                    
                  }}                  
                  defaultValue={formData.name}
                  
                />
                <span className="text-red-600 font-sans text-[11px] h-4 inline-block">
                      {errors.name}
                    </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email*
                </Label>
                <Input
                  name="email"
                  placeholder="abc@example.com"
                  className="col-span-3"
                  onChange={handleInput}
                  defaultValue={formData.email}
                />
                <span className="text-red-600 font-sans text-[11px] h-4 inline-block">
                      {errors.email}
                    </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phoneNumber" className="text-right">
                  Phone Number*
                </Label>
                <Input
                  name="phoneNumber"
                  placeholder="+91-XXXXXXXXXX"
                  className="col-span-3"
                  onChange={handleInput}
                  defaultValue={formData.phoneNumber}
                />
                <span className="text-red-600 font-sans text-[11px] h-4 inline-block">
                      {errors.phoneNumber}
                    </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="hobbies" className="text-right">
                  Hobbies*
                </Label>
                <Input
                  name="hobbies"
                  placeholder="e.g : travelling,etc. "
                  className="col-span-3"
                  onChange={handleInput}
                  defaultValue={formData.hobbies}
                />
                <span className="text-red-600 font-sans text-[11px] h-4 inline-block">
                      {errors.hobbies}
                    </span>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={submitForm}>
                  Save
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
export default AddUser;
