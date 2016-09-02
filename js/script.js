// script.js
// =============================================================================
// =============================================================================
var banner = banner || {} ;
var getParent;
// Start
// =============================================================================
// =============================================================================
function startAd(){

    if (!EB.isInitialized()) {
        EB.addEventListener(EBG.EventName.EB_INITIALIZED, banner.platform_REFER.bannerSetup);
    }else{
        banner.platform_REFER.bannerSetup();
    }
}

// BANNER OBJECT CONFIGURATION
banner.configure = {
    bannerParent_ID: "banner",
    bannerParent: null,
    bannerLast_ELEMENT: 'greenBox',
    bannerLoop_COUNT: 1 ,
    bannerLoop_CURRENT_COUNT: 0 ,
    bannerLoop_TOTAL_COUNT: 0 ,
    bannerLoop_Animation_START: 'playing' ,
    bannerLoop_Animation_END: 'stop' ,
    bannerLoop_Animation_CURRENTSTATE: null, 
}

// BANNER OBJECT METHODS
banner.platform = {

    platform_Methods: {

        startAd: function(){

            if (typeof EB != "undefined") {
               if (!EB.isInitialized() ) {
                EB.addEventListener(EBG.EventName.EB_INITIALIZED, banner.platform_REFER.bannerSetup);
                }else{
                    banner.platform_REFER.bannerSetup();
                }
            }else{
                banner.platform_REFER.bannerSetup();
            }

        },
        
        // PLATFORM TARGET
        platform_TARGET: "sizmek",
        
        // CLICKTHROUGH LOGIC 
        clickThrough_router: function(e){

            if(banner.platform_REFER.platform_TARGET == 'sizmek'){
                EB.clickthrough();
                console.log("Sizmek clickthrough")
            }else{
                window.open(clickTag)
                console.log('GDN_CLICKTHROUGH')
            }

        },
        
        // BANNER SETUP LOGIC 
        bannerSetup: function(){

            // SET BANNER STATE.
            banner.configure.bannerLoop_Animation_CURRENTSTATE = banner.configure.bannerLoop_Animation_START;
            // GET BANNER PARENT
            bannerInstance = document.getElementById(banner.config_REFER.bannerParent_ID);
            // SETUP BANNER CLICKTHROUGH
            bannerInstance.addEventListener('click',banner.platform_REFER.clickThrough_router)
            // SETUP BANNER LOOP MECHANIC
            banner.config_REFER.bannerParent = document.getElementById(banner.config_REFER.bannerParent_ID);
            // UPDATE LOOP COUNT
            banner.config_REFER.bannerLoop_COUNT = banner.config_REFER.bannerParent.getAttribute("data-loopCount");
            // SET ANIMATION END LISTENER
            banner.platform_REFER.PrefixedEvent(  
                    document.getElementById(banner.config_REFER.bannerLast_ELEMENT), 
                    "AnimationEnd", 
                    banner.platform_REFER.AnimationListener
                );
        },

        PrefixedEvent: function(element, type, callback) {
        
            var pfx = ["webkit", "moz", "MS", "o", ""];

            for (var p = 0; p < pfx.length; p++) {
                if (!pfx[p]) type = type.toLowerCase();
                element.addEventListener(pfx[p]+type, callback, false);
            }

        },

        AnimationListener: function(event){
            
           if( (banner.config_REFER.bannerLoop_COUNT - 1) > banner.config_REFER.bannerLoop_CURRENT_COUNT){
              banner.config_REFER.bannerLoop_CURRENT_COUNT ++;

                banner.config_REFER.bannerParent.classList.remove("MC_animation_playing");
                
                setTimeout(function(){
                    banner.config_REFER.bannerParent.classList.add("MC_animation_playing");
                }, 1)

           }else{
                banner.config_REFER.bannerParent.classList.remove("MC_animation_playing");
                banner.config_REFER.bannerParent.classList.add("MC_animation_endFrame");
           }

        }


    }

}

// BANNER CONFIGURE/METHODS SHORTCUTS 
banner.config_REFER = banner.configure;
banner.platform_REFER = banner.platform.platform_Methods;

// ONLOAD LISTENER
//=================================================================
window.addEventListener("load", banner.platform_REFER.startAd);