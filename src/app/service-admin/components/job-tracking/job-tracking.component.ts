import { Component, OnInit } from '@angular/core';
import { MouseEvent } from '@agm/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { ToastrManager } from 'ng6-toastr-notifications';

import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GeocodeService } from 'src/app/geocode.service';
@Component({
  selector: 'app-job-tracking',
  templateUrl: './job-tracking.component.html',
  styleUrls: ['./job-tracking.component.css']
})
export class JobTrackingComponent implements OnInit {
  origin;
  destination;
   // google maps zoom level
  zoom: number = 8;

  // initial center position for the map
  lat: Number = 27.891535;
  lng: Number = 78.078743;
  markers: marker[] = []
  rows:any;
  jobno:any;
  
  jobtable: boolean = false;
  lat1: number;
  lng1: number;
  lat2: number;
  lng2: number;
  km: number;
  comparekmvalue=[]
  calckmValue=[];
  
  constructor(private router:Router, private geocodeService:GeocodeService, private toastr:ToastrManager,private _api: ApiService, public dialog: MatDialog) { }

  ngOnInit(){
    
}
job_search()
{
  this.getDistanceFromLatLonInKm();
  this.jobtable = true;

 let a={
  "job_no":this.jobno,
 }

 this.calckmValue=[];
 this.comparekmvalue=[];
  this._api.job_tracking(a).subscribe(
    (response: any) => {
   
      this.rows = response.Data;
      this.rows.map((e:any)=>{
        this.markers.push({
          lat: e.loc_lat,
          lng: e.loc_long,
          job_no:e.job_no,
          location_text:e.location_text,
          user_mobile_no:e.user_mobile_no,
        
         })
         this.comparekmvalue.push({
          lat: e.loc_lat,
          lng: e.loc_long,
          job_no:e.job_no,
         })
      })
      this.comparekmvalue.push({
        lat: 0,
        lng: 0,
        job_no:0,
       })
       this.comparekmvalue.shift();
       var kmvalue=this.markers.map((aa:any,i)=>{
        var deg2Rad = deg => {
          return deg * Math.PI / 180;
      }

      this.lat1= aa.lat ; this.lng1= aa.lng;this.lat2= this.comparekmvalue[i].lat; this.lng2= this.comparekmvalue[i].lng;
   
      var r = 6371; // Radius of the earth in km
        var dLat = deg2Rad(this.lat2 - this.lat1);   
      var dLon = deg2Rad( this.lng2- this.lng1);
      var a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(deg2Rad(this.lat1)) * Math.cos(deg2Rad(this.lat2)) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      this.km= r * c; // Distance in km
  this.calckmValue.push(this.km)
       })
       this.calckmValue.pop();
      console.log(this.calckmValue);
    }
  );
  this.origin = { lat: 13.0780615 , lng: 80.1469788};
  this.destination = { lat: 13.0930706, lng: 80.2055504 };
  
}
viewpdf(data){
 

}
  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`)
  }
  
  mapClicked($event: MouseEvent) {
    // this.markers.push({
    //   lat: $event.coords.lat,
    //   lng: $event.coords.lng,
    //   draggable: true
    // });
  }
  
  markerDragEnd(m: marker, $event: MouseEvent) {
    console.log('dragEnd', m, $event);
  }
   getDistanceFromLatLonInKm() {
   
    var deg2Rad = deg => {
        return deg * Math.PI / 180;
    }
    this.lat1= 8.186086238957166 ; this.lng1= 77.4093668863787;this.lat2=  8.188438713980196; this.lng2= 77.42146405971492;
    var r = 6371; // Radius of the earth in km
      var dLat = deg2Rad(this.lat2 - this.lat1);   
    var dLon = deg2Rad( this.lng2- this.lng1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2Rad(this.lat1)) * Math.cos(deg2Rad(this.lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    this.km= r * c; // Distance in km

   
}
locationmap(e:any){

  this.geocodeService.geocodeAddress(e.location_text)
  .subscribe((location: any) => {

    let a={
      "_id":e._id,
     "loc_long":location.lng,
      "loc_lat":location.lat,
    }
    this._api.employee_jobwise(a)
    .subscribe((data: any) => {
 
      this.job_search();     
  })
          // this.getAddress(location.lat, location.lng);
})

}
}


// just an interface for type safety.
interface marker {
	lat: number;
	lng: number;
  job_no?:string;
  location_text?:string;
  user_mobile_no:number;
}
