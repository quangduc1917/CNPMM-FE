import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import jwtDecode from 'jwt-decode';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';



@Component({
  selector: 'app-client-header',
  templateUrl: './client-header.component.html',
  styleUrls: ['./client-header.component.css']
})
export class ClientHeaderComponent implements OnInit, OnChanges {

  roles: any;
  username!: string;
  password!: string;
  email!: string;
  userinfo!: string;
 
  passCheck=0;
  passConfirm=0;

  confirmpassword!:String;

  cnewpass !: string;
  cnewspass !: string;
  coldpass !: string;

  name!: string;
  numberphone!: string;
  address!: string;
  id!: number;
  avatar !: string;

  img: File = null;

  @Input()
  keyWork !: string;

  @Input()
  nCountCart !: number;



  checkForm:FormGroup;
  checkSignin:FormGroup;

  constructor(public auth: AuthService, private token: TokenStorageService, private router: Router,private formbuilder: FormBuilder) {
    if (this.token.getToken() != null) {
      this.auth.setLogin(true);
    }

    this.checkForm= new FormGroup({
            username: new FormControl('',[
            Validators.required
            ]),
            email:new FormControl('',[
              Validators.required,
              Validators.email])
    });

    this.checkSignin=new FormGroup({
      email_signin:new FormControl('',[
      Validators.required,
      Validators.email
      ]),
      pass_signin:new FormControl('',[
        Validators.required])
      });

  }
  ngOnChanges(): void {

  }

  ngOnInit() {
    if (this.token.getToken() != null) {
      this.auth.getUserInfo().subscribe(
        (data) => {
          this.userinfo = data?.userName;
          this.name = data?.name;
          this.numberphone = data?.numberPhone;
          this.address = data?.address;
          this.id = data?.userId;
          this.avatar = data?.imgAvatar;
        }
      );
    }
  }

  login() {

    this.auth.login(this.username, this.password).subscribe(
      (data) => {
        this.token.saveToken(data.accessToken);
        this.auth.setLogin(true);
        this.roles = jwtDecode(data.accessToken);
        if (this.roles?.roles === '[ROLE_ADMIN]') {
          localStorage.setItem('role', this.roles?.roles);
          window.location.href = '/dashbroad';
        } else {
          window.location.reload();
        }

      },
      (error) => {
        alert('Login failed!');
      }
    );

  }

  register() {
    if(this.passCheck==0||this.check()==true)
    {
      alert('Đăng kí không thành công');
    }
    else(
      this.auth.register(this.username, this.password, this.email).subscribe(
        (data) => {
          alert('Register success');
          window.location.reload();
        },
        (error) => {
          alert('Register failed');
        }
      )
    )

   
    
  }


  logout() {
    this.token.singOut();
  }

  changePass() {
    this.auth.changePass(this.cnewpass, this.cnewspass, this.coldpass).subscribe(
      (data) => {
        alert('Change password success!');
        window.location.reload();
      }, (error) => {
        alert('change password failed');
      }
    );
  }


  updateProfile() {
    this.auth.updateProfile(this.name, this.numberphone, this.address, this.id).subscribe(
      (data) => {
        alert('Update profile success!');
      }, err => {
        alert('Update profile failed!');
      }
    );
  }

  onChange(event) {
    this.img = event.target.files[0];
  }

  updateAvatar() {

    console.log(this.img);

    this.auth.updateImg(this.img).subscribe(
      (data) => {
        window.location.reload();
        alert('Update avatar success!');

      }, err => {
        alert('Update avatar failed!');
      }
    );
  }

  search() {
    this.router.navigate(['/products/' + this.keyWork]);
  }

  reset()
  {
    this.auth.reset( this.email).subscribe(
      (data) => {
        alert('Reset success');
        window.location.reload();
      },
      (error) => {
        alert('Reset failed');
      }
    );
  }

  check()
  {
    if(this.password!=this.confirmpassword&&this.password!=null&&this.confirmpassword!=null)
    {
      return true;
    }
  
    return false;
  }






check12() {
      var strength = document.getElementById('strength');
      var strongRegex = new RegExp("^(?=.{14,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
      var mediumRegex = new RegExp("^(?=.{10,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
      var enoughRegex = new RegExp("(?=.{8,}).*", "g");
      var pwd = document.getElementById("password");
      if (this.password.length == 0) {
        strength.innerHTML = '<span style="color:green"></span>';
        this.passCheck=0;

      } else if (false == enoughRegex.test(this.password)) {
          
          strength.innerHTML = '<span style="color:green">Tối thiểu 8 kí tự!</span>';
          this.passCheck=0;
      } else if (strongRegex.test(this.password)) {
         
         strength.innerHTML = '<span style="color:green">Mật khẩu: Mạnh!</span>';
         this.passCheck=1;
      } else if (mediumRegex.test(this.password)) {
       
          strength.innerHTML = '<span style="color:black">Mật khẩu: Trung Bình!</span>'; 
          this.passCheck=0;
      } else {
          strength.innerHTML = '<span style="color:red">Mật khẩu: Yếu!</span>';
          this.passCheck=0;
      }
  }



  

}


