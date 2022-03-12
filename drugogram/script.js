
// let table = document.createElement('table');
// let thead = document.createElement('thead');
// let tbody = document.createElement('tbody');

// table.appendChild(thead);
// table.appendChild(tbody);

// // Adding the entire table to the body tag
// document.getElementById('body').appendChild(table);

// // Creating and adding data to first row of the table
// let row_1 = document.createElement('tr');
// let heading_1 = document.createElement('th');
// heading_1.innerHTML = "Sr. No.";
// let heading_2 = document.createElement('th');
// heading_2.innerHTML = "Name";
// let heading_3 = document.createElement('th');
// heading_3.innerHTML = "Company";

// row_1.appendChild(heading_1);
// row_1.appendChild(heading_2);
// row_1.appendChild(heading_3);
// thead.appendChild(row_1);


// // Creating and adding data to second row of the table
// let row_2 = document.createElement('tr');
// let row_2_data_1 = document.createElement('td');
// row_2_data_1.innerHTML = "1.";
// let row_2_data_2 = document.createElement('td');
// row_2_data_2.innerHTML = "James Clerk";
// let row_2_data_3 = document.createElement('td');
// row_2_data_3.innerHTML = "Netflix";

// row_2.appendChild(row_2_data_1);
// row_2.appendChild(row_2_data_2);
// row_2.appendChild(row_2_data_3);
// tbody.appendChild(row_2);


// Creating and adding data to third row of the table
// let row_3 = document.createElement('tr');
// let row_3_data_1 = document.createElement('td');
// row_3_data_1.innerHTML = "2.";
// let row_3_data_2 = document.createElement('td');
// row_3_data_2.innerHTML = "Adam White";
// let row_3_data_3 = document.createElement('td');
// row_3_data_3.innerHTML = "Microsoft";



// function mkrow(no,name,company){
// 	let row_3 = document.createElement('tr');
// 	let row_3_data_1 = document.createElement('td');
// 	row_3_data_1.innerHTML = no;
// 	let row_3_data_2 = document.createElement('td');
// 	row_3_data_2.innerHTML = name;
// 	let row_3_data_3 = document.createElement('td');
// 	row_3_data_3.innerHTML = company;
// 	row_3.appendChild(row_3_data_1);
// 	row_3.appendChild(row_3_data_2);
// 	row_3.appendChild(row_3_data_3);	
// 	return row_3;
// }


hashCode = function(s){
  return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
}



function getrecordtypeid(recordtype){
	if (recordtype == "treatment"){
		return 1;
	}
	if (recordtype == "lab"){
		return 2;
	}

	if (recordtype == "vital"){
		return 3;
	}

	if (recordtype == "note"){
		return 4;
	}

	return 5;


}


// Parse a row of a drug-o-gram 

function parsedogrow(line){

	fields = line.trim().split(",")
	startdt = string2epoch(fields[0].trim());
	stopdt = string2epoch(fields[1].trim());
	recordtype = fields[2].trim();
	recordtypeid = getrecordtypeid(recordtype)
	drug = fields[3].trim();
	if (fields.length > 4){
		notes = fields[4].trim();
	} else {
		notes = '';
	}
	return {"startdt":startdt,"stopdt":stopdt,"recordtype":recordtype,"recordtypeid":recordtypeid,"drug":drug,"notes":notes};


}



// Parse an entire drug-o-gram file (from text)

function parsedog(value){



	// make into rows
	rows = [];

	dates = new Set();
	//dates.add(1);


	drugs = new Set();


	data=  value.trim().split("\n");
	for (let i =0; i< data.length;i++){
		line = data[i]
		console.log(line);

		// get named tuple with fields
		row = parsedogrow(line);
		//line_hash = hashCode(line);
		console.log(row);

		dates.add(row.startdt);
		dates.add(row.stopdt);
		drugs.add(row.recordtypeid+"_"+row.drug);
		
		rows.push(row);
	}

	// spread set to array and sort just in case
	// smallest date first

	console.log("dates",dates);
	uniqdates=[...dates].sort();

	// intersperse dates
	firstdt = uniqdates[0];
	lastdt = uniqdates[uniqdates.length-1];

	// make dates to fill in between first and last
	dates = new Set();
	for (let i =0;i<uniqdates.length;i++){
		dates.add(uniqdates[i]);
	}

	// add in days
	daystep = 7
	step = 604800000;
	step = 60*60*24*1000*daystep;
	for (let i=firstdt;i<lastdt;i+=step){
		dates.add(i);
	}

	// sort the unique dates 
	uniqdates=[...dates].sort();

	//sort the drugs
	uniqdrugs=[...drugs].sort();

	

	// get unique dates


	// get unique drugs

	// rows

	// initialize structure  dates x drugs

	// function mxn(m,n){

	// 	a = []
	// 	for (let i =0;i<m;i++){
	// 		b = []
	// 		for (let j =0;j<n;j++){
	// 			b.push();
			
	// 		}
	// 		a.push(b)

	// 	}
	// 	return a
	// }

	function datesxdrugs(dates,drugs){
		a = {}

		for (let i =0;i<dates.length;i++){
			date = dates[i];
			b = {}
			for (let j =0;j<drugs.length;j++){
				drug = drugs[j];
				b[drug] = 0;
			
			}
			a[date]= b;

		}
		return a


	}

	// holds our indicator variables
	dd = datesxdrugs(uniqdates,uniqdrugs);

	// will be used to lookup data for each cell
	ddrr = datesxdrugs(uniqdates,uniqdrugs);


	// use an indicator variable for whether the 

	for (let i = 0;i<rows.length;i++){
		row = rows[i];
		startdt = row.startdt;
		stopdt = row.stopdt;
		drug = row.recordtypeid+ "_"+ row.drug;

		for(let d = 0;d<uniqdates.length;d++){

			dt = uniqdates[d];
			if (dt>=startdt && dt <= stopdt){

				// add the row to this structure so we can get it later
				ddrr[dt][drug] = rows[i];
				
				// set our indicator variable that the cell is in use
				dd[dt][drug]=1;
				if (dt == startdt){
					dd[dt][drug]=.5;
				}
			}
		}

	}

	console.log(dd);
	console.log(uniqdates);
	console.log(uniqdrugs);

	// for each drug, fill in cells between dates

	// drug , start, stop

	return {"uniqdates":uniqdates,"uniqdrugs":uniqdrugs,"dd":dd,"ddrr":ddrr}

}

function dog2tbl(ddr){
// remove existing tables
var tables = document.getElementsByTagName("TABLE");
for (var i=tables.length-1; i>=0;i-=1)
   if (tables[i]) tables[i].parentNode.removeChild(tables[i]);


	uniqdates = ddr.uniqdates;
	uniqdrugs = ddr.uniqdrugs;
	dd = ddr.dd;
	ddrr  = ddr.ddrr;
	// make header

	let table = document.createElement('table');
	let thead = document.createElement('thead');
	let tbody = document.createElement('tbody');

	table.appendChild(thead);
	table.appendChild(tbody);

	// Adding the entire table to the body tag
	document.getElementById('body').appendChild(table);

	// Creating and adding data to first row of the table
	let row_1 = document.createElement('tr');
	let heading_1 = document.createElement('th');
	heading_1.innerHTML = "Date";
	row_1.appendChild(heading_1);

	// Create headers for drug names
	for (let i =0;i<uniqdrugs.length;i++){
		let heading_2 = document.createElement('th');

		//remove the recordtypeid from heading
		heading = uniqdrugs[i].split("_")[1];
		heading_2.innerHTML = heading;
		row_1.appendChild(heading_2);	
	}
	thead.appendChild(row_1);

	// // Creating and adding data to second row of the table
	// let row_2 = document.createElement('tr');
	// let row_2_data_1 = document.createElement('td');
	// row_2_data_1.innerHTML = "1.";
	// let row_2_data_2 = document.createElement('td');
	// row_2_data_2.innerHTML = "James Clerk";
	// let row_2_data_3 = document.createElement('td');
	// row_2_data_3.innerHTML = "Netflix";

	// row_2.appendChild(row_2_data_1);
	// row_2.appendChild(row_2_data_2);
	// row_2.appendChild(row_2_data_3);
	// tbody.appendChild(row_2);



	// Use this function when we have a gap in the records



	function blankrow(){
				let row_2 = document.createElement('tr');
				let row_2_data_1 = document.createElement('td');
				row_2_data_1.innerHTML = "...";
				row_2.appendChild(row_2_data_1);
				for (let j =0;j<uniqdrugs.length;j++){
					let row_2_data_1 = document.createElement('td');
					row_2_data_1.innerHTML = 0;
					row_2.appendChild(row_2_data_1);
				}
				tbody.appendChild(row_2);

	}

	console.log("dd",dd);

		colors = ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a','#ffff99','#b15928'];
		for (let i =0;i<uniqdates.length;i++){

				date = uniqdates[i];

				// records for each date
				daterow = dd[date];
				console.log("dt",date,dd[date]);
				console.log("dtdr",date,ddrr[date]);
				datarow=ddrr[date];

				let row_2 = document.createElement('tr');
				let row_2_data_1 = document.createElement('td');

				// Set the date field
				row_2_data_1.innerHTML = epoch2string(date);
				row_2.appendChild(row_2_data_1);

				tot = 0

				for (let j =0;j<uniqdrugs.length;j++){
					console.log("date","drug",date,drug);
					console.log("ddrr",date,datarow[drug]);
					drug = uniqdrugs[j];
					let row_2_data_1 = document.createElement('td');
					row_2_data_1.data = datarow[drug];
					console.log(dd[date]);
					if (daterow[drug] > 0){
						//row_2_data_1.innerHTML = daterow[drug] ;
						console.log("row_2_data_1",row_2_data_1);
						row_2_data_1.innerHTML = "&nbsp;" ;
						if (row_2_data_1.data.notes != ""){
							row_2_data_1.innerHTML = row_2_data_1.data.notes;
						}
						// if (row_2_data_1.data.recordtype=="note"){
						// 	row_2_data_1.innerHTML = row_2_data_1.data.notes;
						// }
					}
					tot+=daterow[drug];
					if (daterow[drug] == 1){
						//row_2_data_1.className += " on";
					}
					if (daterow[drug] == .5){
						row_2_data_1.className += " start";
					}

					if (daterow[drug] > 0){

						color = colors[j];
						row_2_data_1.style["background-color"]=color;
					}
					row_2.appendChild(row_2_data_1);
				}

				

				tbody.appendChild(row_2);

		}
		console.log("ddrr",ddrr);
		console.log("dd",dd);
}






function string2epoch(s){
	return Date.parse(s);
}
function epoch2string(e){
	date = new Date(e);
	var formattedDate = (date.getUTCMonth() + 1) + '/' + date.getUTCDate() + '/'  + date.getUTCFullYear()
	return  formattedDate;
}

function parseline(line){
	fields = line.trim().split(",")
	return {"no":fields[0],"name":fields[1],"company":fields[2]};
}

// loaddata("data");

function readSingleFile(e) {
  var file = e.target.files[0];
  if (!file) {
    return;
  }
  var reader = new FileReader();
  reader.onload = function(e) {
    var contents = e.target.result;
    // Display file content
    displayContents(contents);
    document.getElementById("data").value = contents;
	dog2tbl(parsedog(document.getElementById("data").value));

  };
  reader.readAsText(file);
}
 
function displayContents(contents) {
  var element = document.getElementById('file-content');
  element.innerHTML = contents;
}
 
document.getElementById('file-input').addEventListener('change', readSingleFile, false);

dog2tbl(parsedog(document.getElementById("data").value));


document.getElementById("load").onclick = function() {
dog2tbl(parsedog(document.getElementById("data").value));


	}


