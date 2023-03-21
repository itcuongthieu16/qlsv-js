const MaSV = document.getElementById("txtMaSV");
const TenSV = document.getElementById("txtTenSV");
const NgaySinh = document.getElementById("txtNgaySinh");
const GioiTinh = document.querySelectorAll('input[name="gioitinh"]');
const MaKhoa = document.getElementById("txtMaKhoa");
const TenKhoa = document.getElementById("txtTenKhoa");
const boxTable = document.getElementById("boxTable");

class Khoa {
    constructor(MaKhoa, TenKhoa) {
        this.MaKhoa = MaKhoa;
        this.TenKhoa = TenKhoa;
    }
}

class SinhVien {
    constructor(MaSV, TenSV, NgaySinh, GioiTinh, Khoa) {
        this.MaSV = MaSV;
        this.TenSV = TenSV;
        this.NgaySinh = NgaySinh;
        this.GioiTinh = GioiTinh;
        this.Khoa = Khoa;
    }
}

const listSinhVien = JSON.parse(localStorage.getItem("listSinhVien")) || [];

function themSinhVien() {
    let gioiTinh;
    for (let i = 0; i < GioiTinh.length; i++) {
        if (GioiTinh[i].checked) {
            gioiTinh = GioiTinh[i].value;
            break
        }

    }
    const errorMessage = [];

    if (!MaSV.value) errorMessage.push("Mã sinh viên không được để trống!");
    if (!TenSV.value) errorMessage.push("Tên sinh viên không được để trống!");
    if (!MaKhoa.value) errorMessage.push("Mã khoa không được để trống!");
    if (!TenKhoa.value) errorMessage.push("Tên khoa không được để trống!");

    if (errorMessage.length) {
        alert(errorMessage.join("\n"));
        return;
    }

    
    const trungSV = listSinhVien.some((sinhVien) => sinhVien.MaSV === MaSV.value);

    if (trungSV) {
        alert(`Đã tồn tại sinh viên có mã sinh viên ${MaSV.value}`);
        return;
    }

    const newKhoa = new Khoa(MaKhoa.value, TenKhoa.value);
    const newSinhVien = new SinhVien(
        MaSV.value,
        TenSV.value,
        NgaySinh.value,
        gioiTinh,
        newKhoa
    );

    listSinhVien.push(newSinhVien);
    localStorage.setItem("listSinhVien", JSON.stringify(listSinhVien));

    clear();
    hienThiDanhSachSinhVien();
}


function hienThiDanhSachSinhVien() {
    let listSinhVien = JSON.parse(localStorage.getItem("listSinhVien")) || [];

    let html = listSinhVien.map((sinhVien) => {
        return `
            <tr>
                <td><input type="checkbox"></td>
                <td>${sinhVien.MaSV}</td>
                <td>${sinhVien.TenSV}</td>
                <td>${sinhVien.NgaySinh}</td>
                <td>${sinhVien.GioiTinh}</td>
                <td>${sinhVien.Khoa.MaKhoa}</td>
                <td>${sinhVien.Khoa.TenKhoa}</td>
                <td>
                    <a id="btnSua" onclick="suaSinhVien('${sinhVien.MaSV}')" href="#">Sửa</a> | 
                    <a onclick="xoaSinhVien('${sinhVien.MaSV}')"  id="btnXoa" href="#">Xóa</a>
                </td>
            </tr>
        `;
    }).join('');

    document.getElementById("tbodySinhVien").innerHTML = html;
}

function xoaSinhVien(MaSV) {
    let listSinhVien = JSON.parse(localStorage.getItem("listSinhVien")) || [];

    // Lọc ra danh sách sinh viên không chứa sinh viên có mã là MaSV
    let filterSV = listSinhVien.filter((sinhVien) => sinhVien.MaSV !== MaSV);

    // Nếu danh sách đã được lọc khác với danh sách ban đầu thì lưu vào localStorage và cập nhật hiển thị bảng
    if (filterSV.length !== listSinhVien.length) {
        localStorage.setItem("listSinhVien", JSON.stringify(filterSV));
        hienThiDanhSachSinhVien();
    } else {
        alert(`Không tìm thấy sinh viên với mã sinh viên là ${MaSV}`);
    }
}

function suaSinhVien(MaSV) {
    const listSinhVien = JSON.parse(localStorage.getItem("listSinhVien")) || [];

    // Tìm vị trí
    const index = listSinhVien.findIndex((sinhVien) => sinhVien.MaSV === MaSV);

    const editMaSV = document.getElementById("txtMaSV");

    console.log(index);

    if (index !== -1) {
        const sinhVien = listSinhVien[index];
        editMaSV.setAttribute("disabled", "true");
        editMaSV.value = sinhVien.MaSV;
        TenSV.value = sinhVien.TenSV;
        NgaySinh.value = sinhVien.NgaySinh;
        for (let i = 0; i < GioiTinh.length; i++) {
            if (GioiTinh[i].value === listSinhVien[index].GioiTinh) {
                GioiTinh[i].checked = true;
                break
            }

        }
        MaKhoa.value = sinhVien.Khoa.MaKhoa;
        TenKhoa.value = sinhVien.Khoa.TenKhoa;

        // Lưu trữ thông tin sinh viên đang sửa vào biến trung gian
        localStorage.setItem("sinhVienDangSua", JSON.stringify(sinhVien));
    }
}


const btnCapNhat = document.getElementById("btnCapNhat");

btnCapNhat.onclick = function () {
    const listSinhVien = JSON.parse(localStorage.getItem("listSinhVien")) || [];
    const sinhVienDangSua = JSON.parse(localStorage.getItem("sinhVienDangSua"));

    if (sinhVienDangSua) {
        const index = listSinhVien.findIndex((sinhVien) => sinhVien.MaSV === sinhVienDangSua.MaSV);

        if (index !== -1) {
            let gioiTinh;
            for (let i = 0; i < GioiTinh.length; i++) {
                if (GioiTinh[i].checked) {
                    gioiTinh = GioiTinh[i].value;
                    break
                }

            }
            const updateKhoa = new Khoa(MaKhoa.value, TenKhoa.value);
            const updateSinhVien = new SinhVien(MaSV.value, TenSV.value, NgaySinh.value, gioiTinh, updateKhoa);
            listSinhVien.splice(index, 1, updateSinhVien);

            localStorage.setItem("listSinhVien", JSON.stringify(listSinhVien));
            localStorage.removeItem("sinhVienDangSua");

            alert("Cập nhật sinh viên thành công!");
            refreshListSV();
            clear();
        } else {
            alert(`Không tìm thấy sinh viên với mã sinh viên là ${MaSV.value}`);
        }
    } else {
        alert("Không tìm thấy thông tin sinh viên đang sửa!");
    }
};


function refreshListSV() {
    let currentList = JSON.parse(localStorage.getItem("listSinhVien"));

    if (currentList === null || currentList.length === 0) {
        return;
    }

    // Clear the current table
    let tbodySinhVien = document.getElementById("tbodySinhVien");
    tbodySinhVien.innerHTML = "";

    // Re-populate the table with the current list
    for (let i = 0; i < currentList.length; i++) {
        let sinhVien = currentList[i];
        let newRow = document.createElement("tr");
        newRow.innerHTML = `
      <td><input type="checkbox"></td>
      <td>${sinhVien.MaSV}</td>
      <td>${sinhVien.TenSV}</td>
      <td>${sinhVien.NgaySinh}</td>
      <td>${sinhVien.GioiTinh}</td>
      <td>${sinhVien.Khoa.MaKhoa}</td>
      <td>${sinhVien.Khoa.TenKhoa}</td>
      <td><a id="btnSua" onclick="suaSinhVien('${sinhVien.MaSV}')" href="#">Sửa</a> | <a onclick="xoaSinhVien('${sinhVien.MaSV}')"  id="btnXoa" href="#">Xóa</a></td>
      `;
        tbodySinhVien.appendChild(newRow);
    }
}

function hienThiDanhSachSinhVienTimKiem(list = listSinhVien) {
    const tbodySinhVien = document.getElementById("tbodySinhVien");
    let html = "";

    list.forEach((sinhVien) => {
        html += `
            <tr>
                <td><input type="checkbox"></td>
                <td>${sinhVien.MaSV}</td>
                <td>${sinhVien.TenSV}</td>
                <td>${sinhVien.NgaySinh}</td>
                <td>${sinhVien.GioiTinh}</td>
                <td>${sinhVien.Khoa.MaKhoa}</td>
                <td>${sinhVien.Khoa.TenKhoa}</td>
                <td><i class='bx bx-edit' onclick="suaSinhVien('${sinhVien.MaSV}')">Sửa</i> | <a onclick="xoaSinhVien('${sinhVien.MaSV}')"  id="btnXoa" href="#">Xóa</a></td>
            </tr>
        `;
    });

    tbodySinhVien.innerHTML = html;
}

const searchInput = document.getElementById("inputTimKiem");

function searchSinhVien() {
    const keyword = searchInput.value.trim().toLowerCase();

    if (keyword === "") {
        hienThiDanhSachSinhVien(listSinhVien);
        return;
    }

    const filterSV = listSinhVien.filter((sinhVien) => {
        const maSV = sinhVien.MaSV.toLowerCase();
        const tenSV = sinhVien.TenSV.toLowerCase();
        const maKhoa = sinhVien.Khoa.MaKhoa.toLowerCase();
        const tenKhoa = sinhVien.Khoa.TenKhoa.toLowerCase();
        const ngaySinh = sinhVien.NgaySinh

        return (
            maSV.includes(keyword) ||
            tenSV.includes(keyword) ||
            maKhoa.includes(keyword) ||
            tenKhoa.includes(keyword) ||
            ngaySinh.includes(keyword)
        );
    });

    hienThiDanhSachSinhVienTimKiem(filterSV);
}

document.getElementById("btnTimKiem").addEventListener("click", searchSinhVien);



let btnXoaCheckBox = document.getElementById("btnXoaCheckBox");

btnXoaCheckBox.onclick = function () {
    const clickCheckBox = document.querySelectorAll(
        'input[type="checkbox"]:checked'
    );
    const indexCheckBox = [];

    clickCheckBox.forEach(function (checkbox) {
        const row = checkbox.parentElement.parentElement; //cha: tr
        const index = row.rowIndex - 1;
        indexCheckBox.push(index);
    });

    indexCheckBox.sort(function (a, b) {
        return b - a;
    });

    indexCheckBox.forEach(function (index) {
        listSinhVien.splice(index, 1);
        boxTable.deleteRow(index + 1); // Xoá các thẻ tr tương ứng
    });

    localStorage.setItem("listSinhVien", JSON.stringify(listSinhVien));

    alert("Xóa sinh viên thành công!");
};


function clear() {
    MaSV.value = "";
    TenSV.value = "";
    NgaySinh.value = "";
    GioiTinh.value = "";
    MaKhoa.value = "";
    TenKhoa.value = "";
}






























