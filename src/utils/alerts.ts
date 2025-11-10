import Swal, { type SweetAlertOptions } from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const ReactSwal = withReactContent(Swal);

export const sweet = (options: SweetAlertOptions) => {
  ReactSwal.fire({
    buttonsStyling: false,
    customClass: { confirmButton: 'btn btn-primary mt-2' },
    ...options,
  });
};

// ReactSwal.fire({
//   title: 'Confirm Deletion',
//   text: 'Are you sure you want to delete this item?',
//   icon: 'warning',
//   showCancelButton: true,
//   confirmButtonText: 'Yes, delete it!',
//   showCloseButton: true,
//   buttonsStyling: false,
//   customClass: {
//     confirmButton: 'btn btn-primary me-2 mt-2',
//     cancelButton: 'btn btn-danger mt-2',
//   },
// }).then((result) => {
//   if (result.isConfirmed) {
//     sweet({
//       title: 'Deleted!',
//       text: 'Your item has been successfully removed.',
//       icon: 'success',
//     })
//   }
// })