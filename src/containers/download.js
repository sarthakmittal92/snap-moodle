// import axios from 'axios';
// var fileDownload = require('js-file-download');
// function App() {
//     const handlePDFDownload = () => {
//         axios.get('api/endpoint/to/view/', { 
//             responseType: 'blob',
//         }).then(res => {
//             fileDownload(res.data, 'filename.pdf');
//             console.log(res);
//         }).catch(err => {
//             console.log(err);
//         })
// }
// return (
//     <div>
//        <button
//           onClick={() => handlePDFDownload()}>Download File!
//        </button>
//     </div>
//     )
// }