import {
  AlertDialog,
  AlertDialogContent,

} from "@/components/ui/alert-dialog"
import { AlertDialogProps } from "@radix-ui/react-alert-dialog"

export default function Alert({open, onOpenChange, defaultOpen, children} : AlertDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange} defaultOpen={defaultOpen}>
      <AlertDialogContent>
        {children}
      </AlertDialogContent>
    </AlertDialog>
  )
}
