var page_juli = $(".main .nav").offset().top;  //导航条距离文档页面顶部的距离

/*
//方法一
$(window).scroll(function(){
	var browser_juli = $(".main .nav").offset().top - $(document).scrollTop(); //导航条距离浏览器有效显示区顶部的距离
	if( browser_juli <= 0) 
	{
		 $(".main .nav").addClass("position_fixed");
		 if( $(document).scrollTop() <= page_juli )
		 {
		 	$(".main .nav").removeClass("position_fixed");
		 }

	}
});
*/


//方法二
$(window).scroll(
	function()
	{
		var scroll_top = $(document).scrollTop();
		if( scroll_top >= page_juli )
		{
			$(".main .nav").addClass("position_fixed");
		}else
			{
				$(".main .nav").removeClass("position_fixed");
			}
	})
