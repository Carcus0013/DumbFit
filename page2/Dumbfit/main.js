function switchGender(gender) {
    const maleMap = document.getElementById("maleMap");
    const femaleMap = document.getElementById("femaleMap");
  
    if (gender === "male") {
      maleMap.style.display = "block";
      femaleMap.style.display = "none";
    } else {
      maleMap.style.display = "none";
      femaleMap.style.display = "block";
    }
  }
  