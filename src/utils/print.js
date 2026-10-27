// Membuka dialog cetak. Judul dokumen sementara diganti supaya
// browser memakainya sebagai nama file saat "Simpan sebagai PDF".
export function printReport(fileTitle) {
  const original = document.title

  const restore = () => {
    document.title = original
    window.removeEventListener('afterprint', restore)
  }

  window.addEventListener('afterprint', restore)
  document.title = fileTitle
  window.print()
}