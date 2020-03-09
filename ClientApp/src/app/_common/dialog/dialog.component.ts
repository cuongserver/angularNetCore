import { Component, Inject, ViewEncapsulation } from "@angular/core";
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from "@angular/material/dialog";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Subject } from "rxjs";

@Component({
  selector: "app-dialog",
  templateUrl: "./dialog.component.html",
  styleUrls: ["./dialog.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class DialogComponent {
  style: number;
  title: string;
  message: string;
  extraInfo: string;
  information: string;
  button: number;
  allow_outside_click: boolean;
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.style = data.style || 0;
    this.title = data.title;
    this.message = data.message;
    this.extraInfo = data.extraInfo;
    this.information = data.information;
    this.button = data.button;
    this.dialogRef.disableClose = !data.allow_outside_click || false;
  }
  onOk() {
    this.dialogRef.close({ result: "ok" });
  }
  onCancel() {
    this.dialogRef.close({ result: "cancel" });
  }
  onYes() {
    this.dialogRef.close({ result: "yes" });
  }
  onNo() {
    this.dialogRef.close({ result: "no" });
  }
  onAccept() {
    this.dialogRef.close({ result: "accept" });
  }
  onReject() {
    this.dialogRef.close({ result: "reject" });
  }


}
export enum MessageBoxButton {
  Ok = 0,
  OkCancel = 1,
  YesNo = 2,
  AcceptReject = 3
}

export enum MessageBoxStyle {
  Simple = 0,
  Full = 1
};

@Injectable()
export class DialogService {
  private message = new Subject<any>();
  constructor() {
  }
  sendMessage(message: string, extraInfo: string, type = 1) {
    this.message.next({ text: message, extraInfo: extraInfo, type: type });
  }
  getMessage(): Observable<any> {
    return this.message.asObservable();
  }
  clearMessage() {
    this.message.next();
  }

}

export class DialogController {
  static show(dialog: MatDialog, message, extraInfo, title = "Alert",
    information = "", button = 0, allow_outside_click = false,
    style = 0, width = "290px") {
    const dialogRef = dialog.open(DialogComponent, {
      data: {
        title: title || "Alert",
        message: message,
        extraInfo: extraInfo,
        information: information,
        button: button || 0,
        style: style || 0,
        allow_outside_click: allow_outside_click || false
      },
      width: width, panelClass: 'custom-dialog-ovelay',
      closeOnNavigation: true
    });
    return dialogRef.afterClosed();
  }
}
