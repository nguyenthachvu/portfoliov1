import { GoogleAnalyticsService } from 'ngx-google-analytics';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor(
    private $gaService: GoogleAnalyticsService
  ) { }

  sendAnalyticEvent(action: string, category: string, label){
    this.$gaService.event(action, category, label)
  }

  sendAnalyticPageView(path: string, title: string){
    this.$gaService.pageView(path, title)
  }

}
