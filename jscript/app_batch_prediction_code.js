





//################################################################################

// ### 1. MAKE A PREDICTION ON THE IMAGE OR MULTIPLE IMAGES THAT THE USER SUBMITS

//#################################################################################





// the model images have size 96x96

async function model_makePrediction(fname) {
	
	//console.log('met_cancer');
	
	// clear the previous variable from memory.
	let image = undefined;
	
	image = $('#selected-image').get(0);
	
	// Pre-process the image
	let tensor = tf.fromPixels(image)
	.resizeNearestNeighbor([224,224])
	.toFloat();
	
	
	let offset = tf.scalar(127.5);
	
	tensor = tensor.sub(offset)
	.div(offset)
	.expandDims();

	
	// Pass the tensor to the model and call predict on it.
	// Predict returns a tensor.
	// data() loads the values of the output tensor and returns
	// a promise of a typed array when the computation is complete.
	// Notice the await and async keywords are used together.
	let predictions = await model.predict(tensor).data();
	let top5 = Array.from(predictions)
		.map(function (p, i) { // this is Array.map
			return {
				probability: p,
				className: TARGET_CLASSES[i] // we are selecting the value from the obj
			};
				
			
		}).sort(function (a, b) {
			return b.probability - a.probability;
				
		}).slice(0, 3);
		
		// $("#prediction-list").append(`<li class="w3-text-blue fname-font" style="list-style-type:none;">
		// ${fname}</li>`);
		
		top5.forEach(function (p) {
			const className = p.className.replace(/_/g, ' '); // Replace underscores with spaces
			const probabilityInPercentage = (p.probability * 100).toFixed(2) + '%'; // Multiply by 100 and format as a percentage
		
			// Add a condition to exclude certain class names
			if (p.className !== 'mel') { // Replace 'mel' with the class name you want to exclude
				$("#prediction-list").append(`<li style="list-style-type:none;">${className}: ${probabilityInPercentage}</li>`);
			}
		});

	
	// Add a space after the prediction for each image
		
}



function model_delay() {
	
	return new Promise(resolve => setTimeout(resolve, 200));
}


async function model_delayedLog(item, dataURL) {
	
	// We can await a function that returns a promise.
	// This delays the predictions from appearing.
	// Here it does not actually serve a purpose.
	// It's here to show how a delay like this can be implemented.
	await model_delay();
	
	// display the user submitted image on the page by changing the src attribute.
	// The problem is here. Too slow.
	$("#selected-image").attr("src", dataURL);
	$("#displayed-image").attr("src", dataURL); //#########
	
	// log the item only after a delay.
	//console.log(item);
}

async function model_processArray(array) {
	
	for(var item of fileList) {
		
		
		let reader = new FileReader();
		
		// clear the previous variable from memory.
		let file = undefined;
	
		
		reader.onload = async function () {
			
			let dataURL = reader.result;
			
			await model_delayedLog(item, dataURL);
			
			
			
			var fname = file.name;
			
			// clear the previous predictions
			$("#prediction-list").empty();
			
			// 'await' is very important here.
			await model_makePrediction(fname);
		}
		
		file = item;
		
		// Print the name of the file to the console
        //console.log("i: " + " - " + file.name);
			
		reader.readAsDataURL(file);
	}
}