import { AnalyticsService } from 'src/app/services/analytics/analytics.service';
import { LanguageService } from 'src/app/services/language/language.service';

import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, HostListener, OnInit, TemplateRef } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    animations: [
        trigger("animateMenu", [
            transition(":enter", [
                query("*", [
                    style({ opacity: 0, transform: "translateY(-50%)" }),
                    stagger(50, [
                        animate("250ms cubic-bezier(0.35, 0, 0.25, 1)", style({ opacity: 1, transform: "none" }))
                    ])
                ])
            ])
        ])
    ],
    standalone: false
})



export class HeaderComponent implements OnInit {

  responsiveMenuVisible: Boolean = false;
  pageYPosition: number;
  languageFormControl: UntypedFormControl= new UntypedFormControl();
  cvName: string = "";
  cvUrl: SafeResourceUrl;
  private cvModalRef: NgbModalRef;

  constructor(
    private router: Router,
    public analyticsService: AnalyticsService,
    public languageService: LanguageService,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {

    this.languageFormControl.valueChanges.subscribe(val => this.languageService.changeLanguage(val))

    this.languageFormControl.setValue(this.languageService.language)

  }

  scroll(el) {
    if(document.getElementById(el)) {
      document.getElementById(el).scrollIntoView({behavior: 'smooth'});
    } else{
      this.router.navigate(['/home']).then(()=> document.getElementById(el).scrollIntoView({behavior: 'smooth'}) );
    }
    this.responsiveMenuVisible=false;
  }

  openCVModal(content: TemplateRef<any>) {
    this.languageService.translateService.get("Header.cvName").subscribe(cvFileName => {
      this.cvName = cvFileName;
      const cvPath = `/assets/cv/${encodeURIComponent(this.cvName)}#pagemode=none&navpanes=0&view=FitH&zoom=100`;
      this.cvUrl = this.sanitizer.bypassSecurityTrustResourceUrl(cvPath);
      this.responsiveMenuVisible = false;

      this.modalService.dismissAll();
      this.cvModalRef = this.modalService.open(content, {
        backdropClass: 'cv-modal-backdrop',
        centered: true,
        fullscreen: true,
        size: 'xl',
        windowClass: 'cv-modal-window'
      });
    });
  }

  closeCVModal(event?: Event) {
    event?.preventDefault();
    event?.stopPropagation();

    if (this.cvModalRef) {
      this.cvModalRef.dismiss('close');
    }

    this.modalService.dismissAll();
  }

// downloadCV() {
//   this.languageService.translateService.get("Header.cvName").subscribe(cvFileName => {
//     if (cvFileName) {
//       this.analyticsService.sendAnalyticEvent("view_resume", "header", cvFileName);

//       // THÊM dấu / ở trước assets để nó hiểu là đi từ thư mục gốc
//       const cvPath = `/assets/cv/${cvFileName}`; 

//       window.open(cvPath, '_blank');
//     }
//   });
// }

// downloadCV2() {
//   debugger;
//   this.languageService.translateService.get("Header.cvName").subscribe(cvFileName => {
//     debugger;
//     if (cvFileName) {
//       this.analyticsService.sendAnalyticEvent("download_resume", "header", cvFileName);

//       // Tạo một thẻ <a> ẩn để thực hiện lệnh download
//       const link = document.createElement('a');
      
//       // Đường dẫn đến file
//       link.href = `assets/cv/${cvFileName}`; 
      
//       // Thuộc tính quan trọng nhất để trình duyệt hiểu là cần tải về
//       link.download = cvFileName; 
      
//       // Kích hoạt sự kiện click ngầm
//       link.click();
//     }
//   });
// }
  @HostListener('window:scroll', ['getScrollPosition($event)'])
    getScrollPosition(event) {
        this.pageYPosition=window.pageYOffset
    }

    changeLanguage(language: string) {
      this.languageFormControl.setValue(language);
    }
}
