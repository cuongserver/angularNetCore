import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { trigger, style, state, transition, animate } from '@angular/animations';
import { fadeAnimation } from '../../_common/const/animation';

@Component({
  selector: 'app-account-information',
  templateUrl: './account-information.component.html',
  styleUrls: ['./account-information.component.css'],
  animations: fadeAnimation
})
/** AccountInformation component*/
export class AccountInformationComponent {
  private userName
  private userFullName
  private userDeptCode
  private userTitleCode
  private userEnabled
  private userFailedLoginCount
  private titleDesc
  private deptDesc
  private userEmail
  private status
  transitionState: string = 'in';
  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {
    this.refresh();
  }

  private refresh(): void {
    let token = this.jwtHelper.tokenGetter();
    let decodedInfo = this.jwtHelper.decodeToken(token);
    let userID = decodedInfo.unique_name;
    this.http.get('/User/UserInformation',
      {
        params: {
          userName: userID
        }
      }).subscribe(
        (response) => {
          let result = JSON.parse(JSON.stringify(response));
          this.userName = result['user']['userName'];
          this.userFullName = result['user']['userFullName'];
          this.userDeptCode = result['user']['userDeptCode'];
          this.userTitleCode = result['user']['userTitleCode'];
          this.userEnabled = result['user']['userEnabled'];
          this.userFailedLoginCount = result['user']['userFailedLoginCount'];
          this.titleDesc = result['user']['titleDesc'];
          this.deptDesc = result['user']['deptDesc'];
          this.userEmail = result['user']['userEmail'];
          this.status = result['status'];
        },
        (error) => {
        }
      )
  }
}
