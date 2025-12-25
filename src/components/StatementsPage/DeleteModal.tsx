import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

interface DeleteModalProps {
    open: boolean;
    onClose: () => void;
    onDelete: () => void;
    fileName: string;
}

export const DeleteModal = ({ open, onClose, onDelete, fileName }: DeleteModalProps) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">Confirm Delete Statement?</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    This will permanently delete the statement file "{fileName}" and all associated trip data.<br />< br/>
                    Are you sure you want to proceed?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onDelete}>Delete</Button>
                <Button onClick={onClose} autoFocus>Close</Button>
            </DialogActions>
        </Dialog>
    )
}