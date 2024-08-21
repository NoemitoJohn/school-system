import { DialogProps } from "@radix-ui/react-dialog";
import { Dialog, DialogContent } from "./ui/dialog";


export interface ModalProps extends DialogProps {

}


export default function Modal({children, open, onOpenChange, defaultOpen} : ModalProps) {
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange} defaultOpen={defaultOpen}>
      <DialogContent>
        {children}
      </DialogContent>
    </Dialog>
  )
}
