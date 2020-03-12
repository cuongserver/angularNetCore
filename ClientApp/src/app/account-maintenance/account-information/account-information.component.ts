import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
    selector: 'app-account-information',
    templateUrl: './account-information.component.html',
    styleUrls: ['./account-information.component.css']
})
/** AccountInformation component*/
export class AccountInformationComponent {
  private userName
  private userFullName
  private userPass
  private userDeptCode
  private userTitleCode
  private userEnabled
  private userFailedLoginCount
  private titleDesc
  private deptDesc
  private status
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
        },
        (error) => {
          console.log(JSON.stringify(error))
        }
      )
  }
}
