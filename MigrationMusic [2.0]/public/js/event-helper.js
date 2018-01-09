var i = 0;
var txt = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur auctor mauris fringilla, fermentum mauris eu, ultricies ipsum.Maecenas maximus quis nisl nec vehicula. Quisque vel est eu velit finibus lobortis.In ornare erat non nisl lobortis, ut feugiat elit maximus.Nullam blandit tellus vitae justo fermentum accumsan. Vestibulum consequat molestie diam. Suspendisse ultricies massa vel gravida scelerisque.';
var speed = 10;

function showEvent() {
    if (i < txt.length) {
        document.querySelector("#events").innerHTML += txt.charAt(i);
        i++;
    }
}