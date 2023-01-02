import { Component, OnInit } from '@angular/core';
import { MouseEvent } from '@agm/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { ToastrManager } from 'ng6-toastr-notifications';

import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { EmployeeTrackingeditComponent } from '../../employee-trackingedit/employee-trackingedit.component';
import { GeocodeService } from 'src/app/geocode.service';
@Component({
  selector: 'app-employee-tracking',
  templateUrl: './employee-tracking.component.html',
  styleUrls: ['./employee-tracking.component.css']
})
export class EmployeeTrackingComponent implements OnInit {
 // google maps zoom level
  origin;
  destination;
 zoom: number = 8;
 markers: marker[] = []
 // initial center position for the map
 lat: number = 51.673858;
 lng: number = 7.815982;
 rows:any;
 usermobileno:any;
 jobno:any;
 employeetable;
 lat1: number;
 lng1: number;
 lat2: number;
 lng2: number;
 km: number;
 

 

 constructor(private router:Router, private geocodeService:GeocodeService,private toastr:ToastrManager,private _api: ApiService, public dialog: MatDialog) { }

  ngOnInit(){
  }
employee_search()
{
  this.getDistanceFromLatLonInKm();
	this.employeetable=true;
	console.log(this.usermobileno)
	let a={
		"user_mobile_no":this.usermobileno,
	}
	console.log(a);

this._api.employee_tracking(a).subscribe(
	(response: any) => {
		console.log(response.Data);
		this.rows = response.Data;
		this.rows = response.Data;
		this.rows.map((e:any)=>{
		  this.markers.push({
			lat: e.loc_lat,
			lng: e.loc_long,
			job_no:e.job_no,
			location_text:e.location_text,
			user_mobile_no:e.user_mobile_no
		   })
		})
		console.log(this.markers);
	});
  this.origin = { lat: 12.9178635 , lng: 80.1081463};
  this.destination = { lat:  8.193493542596606, lng: 77.43395242448341 };
	
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
    console.log(this.km);
   
}

  employeepopup(item) {
    console.log(item);
    const dialogRef = this.dialog.open(EmployeeTrackingeditComponent, {
      width: '300px',
      data: item,
    });

    dialogRef.afterClosed().subscribe(password => {




    });
  }

  refersh()
  {
    
  }
  locationmap(e){
    console.log(e);
    this.geocodeService.geocodeAddress(e.location_text)
    .subscribe((location: any) => {
      console.log(location)
      let a={
        "_id":e._id,
       "loc_long":location.lng,
        "loc_lat":location.lat,
      }
      this._api.employee_jobwise(a)
      .subscribe((data: any) => {
        console.log(data) 
        this.employee_search();     
    })
            // this.getAddress(location.lat, location.lng);
  })

}
// getAddress(latitude: any, longitude: any) {
//   this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results: any, status: any) => {
//     console.log(results[0].formatted_address)

//   });
// }
}

// just an interface for type safety.
interface marker {
	lat: number;
	lng: number;
	job_no?:string;
  location_text?:string;
  user_mobile_no:number;
	
	
}

