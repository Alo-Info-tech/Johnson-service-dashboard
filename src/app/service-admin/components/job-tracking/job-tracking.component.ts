import { Component, OnInit } from '@angular/core';
import { MouseEvent } from '@agm/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { ToastrManager } from 'ng6-toastr-notifications';

import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GeocodeService } from 'src/app/geocode.service';


// declare module 'googlemaps';
declare var google: any;
@Component({
  selector: 'app-job-tracking',
  templateUrl: './job-tracking.component.html',
  styleUrls: ['./job-tracking.component.css']
})
export class JobTrackingComponent implements OnInit {
  origin;
  destination;
  waypoints=[];
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
  removecalvalue=[];
  
  
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
 this.markers=[];
 this.waypoints=[];
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
         this.lat=this.markers[0].lat;
         this.lng=this.markers[0].lng;
         this.zoom=12;
         this.comparekmvalue.push({
          lat: e.loc_lat,
          lng: e.loc_long,
          job_no:e.job_no,
          location_text:e.location_text,
         })
      })
         if(this.markers.length>1){
    this.origin = { lat: Number(this.markers[0].lat) , lng: Number(this.markers[0].lng)};
    this.destination = { lat: Number(this.markers[1].lat) , lng: Number(this.markers[1].lng)};
   }
  if(this.markers.length>=3){
    this.markers.map((aa:any,i)=>{
     
      if(i>1){
        console.log(i);
         this.waypoints.push({location: { lat: Number(aa.lat), lng: Number(aa.lng) }})
        //  this.waypoints=[{location: { lat: 12.135483950103078, lng: 78.16094138032794 }}]

      }
    })
  }
  console.log("asa",this.origin);
  console.log(  this.waypoints);
      this.comparekmvalue.push({
        lat: 0,
        lng: 0,
        job_no:0,
        location_text:"chennai",
       })
       this.comparekmvalue.shift();
       var kmvalue=this.markers.map((aa:any,i)=>{
      //   var deg2Rad = deg => {
      //     return deg * Math.PI / 180;
      // }
      console.log("aa",aa);

      this.lat1= aa.lat ; this.lng1= aa.lng;this.lat2= this.comparekmvalue[i].lat; this.lng2= this.comparekmvalue[i].lng;
      const geocoder = new google.maps.Geocoder();
      const service = new google.maps.DistanceMatrixService();
  
      // build request
      const origin1 = { lat: Number(this.lat1), lng: Number(this.lng1) };
      const origin2 =aa.location_text;
      const destinationA =this.comparekmvalue[i].location_text;
      const destinationB = { lat: Number(this.comparekmvalue[i].lat), lng: Number(this.comparekmvalue[i].lng) };
  
      const request = {
        origins: [origin1, origin2],
        destinations: [destinationA, destinationB],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false,
      };
      console.log(this.comparekmvalue[i]);
      service.getDistanceMatrix(request).then((response) => {
        console.log('sdasjy', response.rows[0].elements[0].distance.text)
        this.km=response.rows[0].elements[0].distance.text;
        this.calckmValue.push(this.km)
      })
      // var r = 6371; // Radius of the earth in km
      //   var dLat = deg2Rad(this.lat2 - this.lat1);   
      // var dLon = deg2Rad( this.lng2- this.lng1);
      // var a =
      //     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      //     Math.cos(deg2Rad(this.lat1)) * Math.cos(deg2Rad(this.lat2)) *
      //     Math.sin(dLon / 2) * Math.sin(dLon / 2);
      // var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      // this.km= r * c; 
  
       })
       console.log(this.calckmValue);
      //  this.calckmValue.pop();
      setTimeout(() => {
      
         this.calckmValue.pop()
         console.log(this.calckmValue);
      }, 500);
    }
  );
  // this.removecalvalue=['a','b','c','d']; 
   var aabb= this.removecalvalue.pop()


 
 
  
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
