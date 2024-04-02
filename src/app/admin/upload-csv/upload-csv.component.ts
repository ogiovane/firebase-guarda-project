import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import * as Papa from 'papaparse';


@Component({
  selector: 'app-upload-csv',
  standalone: true,
  imports: [],
  templateUrl: './upload-csv.component.html',
  styleUrl: './upload-csv.component.scss'
})
export class UploadCsvComponent {
  constructor(private firestore: AngularFirestore) {}

  onFileSelect(input: Event) {
    const files = (input.target as HTMLInputElement).files;
    if (files && files.length) {
      const file = files[0];
      Papa.parse(file, {
        complete: (result) => {
          console.log('Parsed: ', result);
          this.uploadData(result.data);
        },
        header: true
      });
    }
  }

  uploadData(data: any[]) {
    const collection = this.firestore.collection('cadastros');
    data.forEach(item => {
      collection.add(item).then(ref => {
        console.log('Added document with ID: ', ref.id);
      });
    });
  }
}
