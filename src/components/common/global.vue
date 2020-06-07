<script>
	const dateFormat = date=>{
		var year = date.getFullYear();
		var month = date.getMonth()+1;
		var day = date.getDate();
		month = month>9?month:'0'+month;
		day = day>9?day:'0'+day;
		return year+'-'+month+'-'+day;
	}
	export default {
		dateFormat: dateFormat
	}
</script>