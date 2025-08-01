
// Countdown Timer
window.addEventListener('DOMContentLoaded', (event) => {
    const deadline = new Date(nextDraw).getTime();
    
    setInterval(() => {
        const now = new Date().getTime();
        const distance = deadline - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        if (distance < 0) {
            days = 0;
            hours = 0;
            minutes = 0;
            seconds = 0;
        }
        
        document.querySelector('#js-timer-days').innerText = days;
        document.querySelector('#js-timer-hours').innerText = hours;
        document.querySelector('#js-timer-minutes').innerText = minutes;
        document.querySelector('#js-timer-seconds').innerText = seconds;

    }, 1000);
});

  document.addEventListener('DOMContentLoaded', function() {
    // Define a map of planId to the specific HTML code you want to prepend (just first two letters of each plan name)
    const htmlForPlanId = {
        'pln_nickel-1-off-9eeh0utn': '<div class="plan-item nickel">Ni</div>',
        'pln_bronze-1-off-4gi0jba': '<div class="plan-item bronze">Br</div>',
        'pln_silver-1-off-bdrc0hrb': '<div class="plan-item silver">Si</div>',
        'pln_gold-1-off-5frd0hra': '<div class="plan-item gold">Go</div>',
        'pln_diamond-1-off-nwre0hma': '<div class="plan-item diamond">Di</div>',
        
        // For subscription plans (not filtered by timestamp)
        'pln_basic-plan-t16v0tq1': '<div class="plan-item basic">Ba</div>',
        'pln_plus-plan-4u8i0qu5': '<div class="plan-item plus">Pl</div>',
        'pln_premium-plan-g96w0t1t': '<div class="plan-item premium">Pr</div>',
        'pln_ultimate-plan-v46x0thq': '<div class="plan-item ultimate">Ul</div>'
    };

    // Define a map of planId to their respective values (only for ONETIME plans)
    const planValueMap = {
        'pln_nickel-1-off-9eeh0utn': 1,
        'pln_bronze-1-off-4gi0jba': 10,
        'pln_silver-1-off-bdrc0hrb': 50,
        'pln_gold-1-off-5frd0hra': 200,
        'pln_diamond-1-off-nwre0hma': 500
    };

    // Set the target date (Sept 18, 2024 at 7:00 PM AEST) for comparison
    const targetDate = new Date(nextDraw);
    console.log("Target date (local time):", targetDate);

    // Calculate the start date (7:00 PM on Sept 11)
    const windowStartDate = new Date(targetDate);
    windowStartDate.setDate(targetDate.getDate() - 7); // Subtract 7 days
    windowStartDate.setHours(19, 0, 0, 0); // Set to 7:00 PM on Sept 11
    console.log("Window start date:", windowStartDate);

    // Set the exact cutoff time (6:59 PM on Sept 18)
    const windowEndDate = new Date(targetDate);
    windowEndDate.setHours(18, 59, 59, 999); // Set cutoff to 6:59 PM on the target date
    console.log("Window end date (6:59 PM):", windowEndDate);

    $memberstackDom.getCurrentMember().then(function(member) {
        const planConnections = member.data.planConnections;
        let hasActiveSubscription = false; // Flag to track active subscriptions
        
        // Parse the 1-time-purchases JSON string to an actual object
        let onetimePurchases = member.data.customFields['1-time-purchases'];
        let totalOneTimeValue = 0; // Initialize the total value for 1-time purchases
        
        if (onetimePurchases) {
            try {
                onetimePurchases = JSON.parse(onetimePurchases); // Convert JSON string to object
            } catch (error) {
                console.error('Failed to parse 1-time-purchases:', error);
                onetimePurchases = [];
            }
        }

        // Process ONETIME purchases from the custom field and filter based on the time window
        if (onetimePurchases && Array.isArray(onetimePurchases)) {
            onetimePurchases.forEach(function(purchase) {
                const purchaseDate = new Date(purchase.timestamp);
                console.log("Processing ONETIME purchase:", purchase.planId, "Date:", purchaseDate);

                // Only include ONETIME purchases made between 7:00 PM on DATE and 6:59 PM on DATE
		if (purchaseDate >= windowStartDate && purchaseDate <= windowEndDate) {
		  console.log("ONETIME purchase is within window:", purchase.planId);
		  const planHtml = htmlForPlanId[purchase.planId];
		  const planValue = planValueMap[purchase.planId] || 0;
		
		  // 🔁 Check if it qualifies for 5X early bird
		  let multiplier = 1;
		  if (
		    typeof earlyBirdStart !== 'undefined' &&
		    typeof earlyBirdEnd !== 'undefined' &&
		    earlyBirdStart instanceof Date &&
		    earlyBirdEnd instanceof Date &&
		    !isNaN(earlyBirdStart) &&
		    !isNaN(earlyBirdEnd)
		  ) {
		    if (purchaseDate >= earlyBirdStart && purchaseDate <= earlyBirdEnd) {
		      multiplier = 5;
		      console.log(`Early bird 5X applied to ${purchase.planId}`);
		    }
		  }
		
		  if (planHtml && document.getElementById("1-off-container")) {
		    const planContainer = document.createElement("div");
		    planContainer.innerHTML = planHtml;
			if (multiplier === 5) {
			  const badge = document.createElement("div");
			  badge.innerText = "5x";
			  badge.className = "plan-badge-5x";
			  planContainer.style.position = "relative";
			  planContainer.appendChild(badge);
			}
  
		    document.getElementById("1-off-container").prepend(planContainer);
		  }
		
		  totalOneTimeValue += planValue * multiplier;
		} else {
                    console.log("ONETIME purchase is outside window:", purchase.planId);
                }
            });
        }

	// ✅ Highlight the 1-off container if we're in the early bird window
	// const oneOffContainer = document.getElementById("1-off-container");

	// if (
	//   typeof earlyBirdStart !== 'undefined' &&
	//   typeof earlyBirdEnd !== 'undefined' &&
	//   earlyBirdStart instanceof Date &&
	//   earlyBirdEnd instanceof Date &&
	//   !isNaN(earlyBirdStart) &&
	//   !isNaN(earlyBirdEnd) &&
	//   oneOffContainer
	// ) {
	//   const now = new Date();
	//   if (now >= earlyBirdStart && now <= earlyBirdEnd) {
	//     oneOffContainer.style.border = "1px solid #FFF89B";
	//     oneOffContainer.style.boxShadow = "0px 0px 15px 10px rgba(249, 255, 84, 0.25)";
	//   } else {
	//     oneOffContainer.style.border = "";
	//     oneOffContainer.style.boxShadow = "";
	//   }
	// }


        // Update the total 1-time entries in the span with ID "1-off-entry" (check if the element exists)
        const oneOffEntryElement = document.getElementById("1-off-entry");
        if (oneOffEntryElement) {
            oneOffEntryElement.textContent = totalOneTimeValue;
        }

        // Process SUBSCRIPTION plans that are ACTIVE (no timestamp filtering here)
        planConnections.forEach(function(plan) {
            if (plan.status === "ACTIVE") {
                console.log("Processing SUBSCRIPTION plan:", plan.planId);
                const planHtml = htmlForPlanId[plan.planId];

                if (planHtml) {
                    const planContainer = document.createElement("div");
                    planContainer.innerHTML = planHtml;

                    // Prepend the subscription plan to the weekly container
                    if (plan.type === "SUBSCRIPTION") {
                        const weeklyContainer = document.getElementById("weekly-container");
                        if (weeklyContainer) {
                            weeklyContainer.prepend(planContainer);
                        }
                        hasActiveSubscription = true; // Mark that an active subscription was found
                    }
                }
            }
        });

        // If an active subscription exists, hide the 'add-weekly-plan' element
        if (hasActiveSubscription) {
            const addWeeklyPlanElement = document.getElementById("add-weekly-plan");
            if (addWeeklyPlanElement) {
                addWeeklyPlanElement.style.display = "none"; // Hide the element
            }
        }

        // Retrieve the existing "entry-count" value
        const entryCountElement = document.getElementById("entry-count");
        let entryCountValue = 0;
        if (entryCountElement) {
            entryCountValue = parseInt(entryCountElement.textContent) || 0;
        }

        // Sum the totalOneTimeValue and entryCountValue
        //const sumTotal = totalOneTimeValue + entryCountValue;
        // Only include entryCountValue if user has an active subscription
				const sumTotal = hasActiveSubscription ? totalOneTimeValue + entryCountValue : totalOneTimeValue;


        // Render the sum in the element with ID "sum-entry-result"
        const sumEntryResultElement = document.getElementById("sum-entry-result");
        if (sumEntryResultElement) {
            sumEntryResultElement.textContent = sumTotal;
        }
        
        const hasActiveOnetimePlan = planConnections.some(plan =>
          plan.type === "ONETIME" &&
          plan.status?.toUpperCase() === "ACTIVE" &&
          planValueMap.hasOwnProperty(plan.planId)
        );

        if (!hasActiveSubscription && !hasActiveOnetimePlan) {
          const couponContainer = document.getElementById("coupon-container");
          if (couponContainer) {
            couponContainer.style.display = "none";
            document.getElementById("coupon-cat-container").style.display = "none";
            document.getElementById("to-see-coupons").style.display = "block";
          }
        }
    
    });
});

document.addEventListener('DOMContentLoaded', function() {
    window.fsAttributes = window.fsAttributes || [];
    window.fsAttributes.push([
        'cmsfilter',
        (filterInstances) => {
            const filterInstance = filterInstances[0]; // Adjust the index if needed for specific instance

            document.querySelectorAll('input[type="radio"]').forEach((radio) => {
                radio.addEventListener('click', function() {
                    const label = this.closest('label') || document.querySelector(`label[for="${this.id}"]`); // Find the label for the radio

                    if (this.dataset.selected === "true") {
                        this.checked = false; // Deselect
                        this.dataset.selected = "false";
                        this.classList.remove('is-active-inputactive'); // Remove the class from the radio
                        if (label) label.classList.remove('is-active-inputactive'); // Remove the class from the label
                        filterInstance.resetFilters(); // Reset the Finsweet filter
                    } else {
                        // Deselect all other radio buttons and their labels
                        document.querySelectorAll('input[type="radio"]').forEach(r => {
                            r.dataset.selected = "false";
                            r.classList.remove('is-active-inputactive');
                            const rLabel = r.closest('label') || document.querySelector(`label[for="${r.id}"]`);
                            if (rLabel) rLabel.classList.remove('is-active-inputactive');
                        });
                        this.dataset.selected = "true";
                        this.classList.add('is-active-inputactive'); // Add the class to the newly selected radio
                        if (label) label.classList.add('is-active-inputactive'); // Add the class to the label
                    }
                });
            });
        },
    ]);
});

const cmsList = document.querySelector('[fs-cmsload-element="list"]'); // CMS list wrapper

if (cmsList) {
  const intersectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        <!-- console.log('CMS item is now visible:', entry.target); -->
        window.fsAttributes.copyclip.init(); // Reinitialize Copy to Clipboard
      }
    });
  });

  const observeCMSItems = () => {
    const cmsItems = document.querySelectorAll('[fs-cmsload-element="list"] .w-dyn-item'); // CMS items
    cmsItems.forEach((item) => {
      if (!item.hasAttribute('data-intersected')) {
        intersectionObserver.observe(item);
        item.setAttribute('data-intersected', 'true'); // Mark as observed
      }
    });
  };

  // Observe the initial items
  observeCMSItems();

  // MutationObserver to detect new items
  const mutationObserver = new MutationObserver(() => {
    <!-- console.log('New CMS items detected!'); -->
    observeCMSItems(); // Observe new items
  });

  mutationObserver.observe(cmsList, { childList: true, subtree: true });
} else {
  <!-- console.error('CMS list wrapper not found.'); -->
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Wait for Memberstack to load current member data
    const memberData = await window.$memberstackDom.getCurrentMember();

    // Target the elements
    const noPU = document.getElementById("noPU");
    const hasP = document.getElementById("hasP");
    const hasU = document.getElementById("hasU");
    const save50PU = document.getElementById("save50PU");

    if (memberData && memberData.data) {
      // Retrieve subscriptions from Memberstack
      const subscriptions = memberData.data.planConnections || [];

      // Filter active subscriptions (adjust if your subscription object uses a different property)
      const activeSubscriptions = subscriptions.filter(subscription =>
        subscription.status && subscription.status.toLowerCase() === "active"
      );

      // Flags for detecting active Premium and Ultimate subscriptions
      const hasPremium = activeSubscriptions.some(plan => plan.planId.toLowerCase().includes("premium"));
      const hasUltimate = activeSubscriptions.some(plan => plan.planId.toLowerCase().includes("ultimate"));

      // Display the appropriate elements based on active subscriptions
      if (hasPremium) {
        console.log("User has an active Premium weekly plan.");
        if (hasP) hasP.style.display = "block";
        if (save50PU) save50PU.style.display = "block";
      }

      if (hasUltimate) {
        console.log("User has an active Ultimate weekly plan.");
        if (hasU) hasU.style.display = "block";
        if (save50PU) save50PU.style.display = "block";
      }

      if (!hasPremium && !hasUltimate) {
        console.log("User has no active Premium or Ultimate weekly plan.");
        if (noPU) noPU.style.display = "flex";
      }
    } else {
      console.log("No user is logged in or no plan data available.");
      if (noPU) noPU.style.display = "block";
    }
  } catch (error) {
    console.error("Error fetching Memberstack data:", error);
    if (noPU) noPU.style.display = "block"; // Fallback in case of error
  }
});

// Wait for Memberstack to load
window.addEventListener("DOMContentLoaded", async () => {
    const memberData = await window.$memberstackDom.getCurrentMember();
    const memberstack = window.$memberstackDom;

    if (memberData) {
        const user = memberData.data; // Access the logged-in user's data
        let favouritestores = user.customFields?.favouritestores || []; // Default to an empty array if undefined

        // Only initialize the field if it does not exist
        if (!user.customFields?.favouritestores) {
            console.log("Initializing 'favouriteStores' field...");
            await memberstack.updateMember({
                customFields: {
                    favouritestores: favouritestores // Use the existing array or default to an empty array
                }
            });
        }

        // Set up click event for star icons
        document.querySelectorAll(".store-star").forEach((star) => {
            const storeSlug = star.dataset.storeId; // Get the slug from the data attribute

            // Set initial state based on user data
            if (favouritestores.includes(storeSlug)) {
                star.classList.add("favourited"); // Add the 'favourited' class
            }

            // Add click event listener
            star.addEventListener("click", async () => {
                if (favouritestores.includes(storeSlug)) {
                    // Remove slug from the array
                    const index = favouritestores.indexOf(storeSlug);
                    if (index > -1) favouritestores.splice(index, 1);
                    star.classList.remove("favourited");
                } else {
                    // Add slug to the array
                    favouritestores.push(storeSlug);
                    star.classList.add("favourited");
                }

                // Update Memberstack user data
                console.log("Updating favouriteStores:", favouritestores);
                await memberstack.updateMember({
                    customFields: {
                        favouritestores: favouritestores // Correctly update under customFields
                    }
                });
            });
        });
    } else {
        console.error("No member data found.");
    }
});

window.fsAttributes = window.fsAttributes || [];
window.fsAttributes.push([
  'modal',
  (modalInstance) => {
    console.log('✅ Finsweet modal is ready');
    window._fsModalReady = true; // Set a global flag
    window._fsModalInstance = modalInstance;
  }
]);

  function initCMSDealURLs(scope = document) {
  $(scope).find(".cms-deal-url").each(function () {
    let url = $(this).text().trim();

    // Skip if already shortened
    if (!url.startsWith("http")) return;

    try {
      const domain = new URL(url).hostname.replace(/^www\./, "");
      $(this).text(domain);
    } catch (e) {
      console.error("Invalid URL:", url);
    }
  });
}

document.querySelector(".modal-inner").addEventListener("click", function(event) {
  // Allow clicks on the .modal-close to bubble up and close modal
  if (!event.target.closest(".modal-close")) {
    event.stopPropagation();
  }
});

$(document).ready(function () {
  function getRootDomain(url) {
    try {
      return new URL(url).hostname.replace(/^www\./, '');
    } catch (e) {
      return url;
    }
  }

  $(document).on('click', '.store-card', function () {
    const $card = $(this);
    const storeName = $card.attr('data-store-name');
    const storeWebsite = $card.attr('data-store-website');
    const storeSlug = $card.attr('data-store-slug');
    const storeDeal = $card.find('.data-store-deal').attr('data-store-deal');
    const storeDealTitle = $card.find('.data-store-deal').attr('data-deal-title');
    const storeDealType = $card.find('.data-store-deal').attr('data-deal-type');
    const storeDealEnd = $card.find('.data-store-deal').attr('data-deal-end');
    const storeDealDescription = $card.find('.data-store-deal').attr('data-deal-description');
    const storeImg = $card.find('.data-store-img').attr('src');
    const rootDomain = getRootDomain(storeWebsite);

    $('#modal-store-name').text(storeName || "Unknown Store");
    $('#modal-store-website').text(rootDomain || "");
    $('#modal-store-visit-url').attr("href", `${storeWebsite}?utm_source=rewardszn.com`);
    $('#modal-store-deal').text(storeDeal || "");
    $('#modal-store-deal-title').text(storeDealTitle || "");
    $('#modal-store-deal-description').text(storeDealDescription || "");
    $('#modal-store-deal-title-off').toggle(!!storeDealTitle);
    $('#modal-store-deal-type, #modal-store-deal-type-2').text(storeDealType || "");
    $('.store-star-modal').attr("data-store-id", storeSlug || "");

    if (storeImg && !storeImg.includes("placeholder")) {
      $('#modal-store-img').attr("src", storeImg).show();
    } else {
      $('#modal-store-img').hide();
    }

    // Deal end
    if (storeDealEnd) {
      const today = new Date();
      const endDate = new Date(storeDealEnd);
      today.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      const daysLeft = Math.floor((endDate - today) / (1000 * 60 * 60 * 24));
      if (daysLeft > 0) {
        $('#deal-days-left').text(`${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`);
        $('#deal-days-container').show();
      } else if (daysLeft === 0) {
        $('#deal-days-left').text("Ends today!");
        $('#deal-days-container').show();
      } else {
        $('#deal-days-container').hide();
      }
    } else {
      $('#deal-days-container').hide();
    }

    // Visuals
    $('#modal-selected-icon, #modal-sitewide-icon').hide();
    $('.sale-type-modal').show().css('background-color', '');
    if (storeDealType === "Sitewide") {
      $('.sale-type-modal').css('background-color', '#207C22');
      $('#modal-sitewide-icon').show();
      $('.div-block-135').css('border-color', 'rgb(0 126 2 / 60%)');
      $('#modal-deals-wrapper').show();
    } else if (storeDealType === "Selected") {
      $('.sale-type-modal').css('background-color', '#EF8300');
      $('#modal-selected-icon').show();
      $('.div-block-135').css('border-color', 'rgb(239 131 0 / 60%)');
      $('#modal-deals-wrapper').show();
    } else {
      $('.sale-type-modal, #modal-deals-wrapper').hide();
    }

    // Favourite sync
    if (window.favouritestores?.includes(storeSlug)) {
      $('.store-star-modal').addClass('favourited');
    } else {
      $('.store-star-modal').removeClass('favourited');
    }

    // ✅ Show modal
    requestAnimationFrame(() => {
      disableScrollLock();
      $('#custom-modal').fadeIn(150);
    });
    $('.modal-inner').removeClass('slide-down').addClass('slide-up');
    $('.w-nav').css('z-index', '89');

    });

    $(document).on('click', '.modal-bg, .modal-close', function () {
      const $modal = $('#custom-modal');
      const $inner = $modal.find('.modal-inner');

      // Trigger slide-down
      $inner.removeClass('slide-up').addClass('slide-down');
			
      // Start fading out the backdrop at the same time
      $modal.fadeOut(300, () => {
      	enableScrollLock();
        $inner.removeClass('slide-down');
        $('.w-nav').css('z-index', '1000');
      });
    });

});

  document.addEventListener("DOMContentLoaded", function () {
    function disableBackgroundScroll() {
      document.body.classList.add("no-scroll");
    }

    function enableBackgroundScroll() {
      document.body.classList.remove("no-scroll");
    }

    const modal = document.getElementById("custom-modal");

    const observer = new MutationObserver(() => {
      const isVisible = window.getComputedStyle(modal).display !== "none" && modal.style.opacity !== "0";
      if (isVisible) {
        disableBackgroundScroll();
      } else {
        enableBackgroundScroll();
      }
    });

    if (modal) {
      observer.observe(modal, { attributes: true, attributeFilter: ["style", "class"] });
    }
  });

  document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("storeSearch");
    const spacer = document.createElement("div"); // Create a temporary spacer div

    // Prevent iOS from restoring scroll position on refresh
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    input.addEventListener("focus", function () {
      spacer.style.height = "50vh"; // Pushes content up
      spacer.style.width = "100%";
      document.body.appendChild(spacer);
      setTimeout(() => {
        input.scrollIntoView({ behavior: "instant", block: "start" });

        requestAnimationFrame(() => {
          window.scrollBy(0, -15); // Adjust final positioning
        });
      }, 400); // Ensures keyboard is open before scrolling
    });

    input.addEventListener("blur", function () {
      if (spacer.parentNode) {
        spacer.parentNode.removeChild(spacer); // Remove spacer after input loses focus
      }
    });
  });

  $(document).ready(function () {
    function filterStores() {
      var searchText = $("#storeSearch").val().toLowerCase();

      // Show/hide based on search input length
      if (searchText.length > 0) {
        $(".div-block-151").hide();
        $(".div-block-144").hide();
        $(".div-block-157").show();
      } else {
        $(".div-block-151").show();
        $(".div-block-144").show();
        $(".div-block-157").hide();
      }

      $(".w-dyn-item").each(function () {
        var storeCard = $(this).find(".store-card");
        var storeName = storeCard.attr("data-store-name");

        if (storeName) {
          storeName = storeName.toLowerCase();
          if (storeName.includes(searchText)) {
            $(this).show();
          } else {
            $(this).hide();
          }
        }
      });
    }

    // Run filter on keyup
    $("#storeSearch").on("keyup", filterStores);

    // Clear input and reset view when .div-block-157 is clicked
    $(".div-block-157").on("click", function () {
      $("#storeSearch").val(""); // Clear the search input
      filterStores(); // Reset visibility
    });
  });

  $(document).ready(function () {
    $("#storeSearch").on("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault(); // Prevents form submission
      }
    });
  });

  function initSaleTypeColors(scope = document) {
  const cards = scope.matches?.('.store-card')
    ? [scope]
    : scope.querySelectorAll('.store-card');

  $(cards).each(function (index) {
    const storeCard = $(this);
    const dealElement = storeCard.find('.data-store-deal');
    const dealType = dealElement.attr('data-deal-type');
    const badge = storeCard.find('.sale-type-card');

    // console.log(`Card #${index}: dealType=${dealType}`);

    if (!dealType) return;

    if (dealType === "Sitewide") {
      badge.css('background-color', '#207C22');
    } else if (dealType === "Selected") {
      badge.css('background-color', '#EF8300');
    } else if (dealType === "None") {
      badge.hide();
    }
  });
}

window.addEventListener("DOMContentLoaded", async () => {
  const memberstack = window.$memberstackDom;
  const memberData = await memberstack.getCurrentMember();

  if (!memberData) return console.error("No member data found.");
  const user = memberData.data;
  window.favouritestores = user.customFields?.favouritestores || [];

  if (!user.customFields?.favouritestores) {
    await memberstack.updateMember({
      customFields: { favouritestores: window.favouritestores }
    });
  }

  // ✅ Init store-card stars on load
  initFavouriteStars(); 

  // Modal star logic (leave this here)
  const modalStar = document.querySelector(".store-star-modal");
  if (!modalStar) return;

  modalStar.addEventListener("click", async () => {
    const storeSlug = modalStar.dataset.storeId;
    if (!storeSlug) return;

    const isFavourited = window.favouritestores.includes(storeSlug);

    if (isFavourited) {
      window.favouritestores = window.favouritestores.filter(id => id !== storeSlug);
      modalStar.classList.remove("favourited");
    } else {
      window.favouritestores.push(storeSlug);
      modalStar.classList.add("favourited");
    }

    await memberstack.updateMember({
      customFields: { favouritestores: window.favouritestores }
    });

    // Sync the corresponding card star
    const matchingCardStar = document.querySelector(
      `.store-card[data-store-slug="${storeSlug}"] .store-star`
    );

    if (matchingCardStar) {
      if (window.favouritestores.includes(storeSlug)) {
        matchingCardStar.classList.add("favourited");
      } else {
        matchingCardStar.classList.remove("favourited");
      }
    }
  });
});

function initFavouriteStars(scope = document) {
  if (!window.favouritestores) return;

  const cards = scope.matches?.('.store-card') ? [scope] : scope.querySelectorAll('.store-card');

  cards.forEach(card => {
    const slug = card.getAttribute('data-store-slug');
    const star = card.querySelector('.store-star');
    if (!slug || !star) return;

    if (window.favouritestores.includes(slug)) {
      star.classList.add('favourited');
    } else {
      star.classList.remove('favourited');
    }
  });
}

  function setActivePage(activeId) {
    // Save to localStorage
    localStorage.setItem("activeRewardSZNTab", activeId);

    const pages = [
      { id: "store-page", show: [".div-block-119"], hide: [".div-block-55", ".div-block-156"] },
      { id: "giveaway-page", show: [".div-block-55", ".div-block-156"], hide: [".div-block-119"] }
    ];

    pages.forEach(page => {
      const isActive = page.id === activeId;
      const tab = document.getElementById(page.id);
      const paths = tab.querySelectorAll("svg path");

      // Show/Hide relevant content
      page.show.forEach(sel => {
        document.querySelector(sel).style.display = isActive ? "block" : "none";
      });
      page.hide.forEach(sel => {
        document.querySelector(sel).style.display = isActive ? "none" : "block";
      });

      // Update SVG path fill
      paths.forEach(path => {
        path.setAttribute("fill", isActive ? "white" : "#425572");
      });
    });
  }

  // Add event listeners
  document.getElementById("store-page").addEventListener("click", () => setActivePage("store-page"));
  document.getElementById("giveaway-page").addEventListener("click", () => setActivePage("giveaway-page"));

  // On load: restore last active tab or default to 'giveaway-page'
  document.addEventListener("DOMContentLoaded", () => {
    const savedTab = localStorage.getItem("activeRewardSZNTab") || "giveaway-page";
    setActivePage(savedTab);
  });

function initStoreCategoryIcons(scope = document) {
  const storeCards = document.querySelectorAll(".store-card");

  // Define your category-to-SVG mapping here
  const categoryIcons = {
    home: `<svg fill="#25354C" width="65px" height="65px" viewBox="0 -64 640 640" xmlns="http://www.w3.org/2000/svg">
<path d="M160 224v64h320v-64c0-35.3 28.7-64 64-64h32c0-53-43-96-96-96H160c-53 0-96 43-96 96h32c35.3 0 64 28.7 64 64zm416-32h-32c-17.7 0-32 14.3-32 32v96H128v-96c0-17.7-14.3-32-32-32H64c-35.3 0-64 28.7-64 64 0 23.6 13 44 32 55.1V432c0 8.8 7.2 16 16 16h64c8.8 0 16-7.2 16-16v-16h384v16c0 8.8 7.2 16 16 16h64c8.8 0 16-7.2 16-16V311.1c19-11.1 32-31.5 32-55.1 0-35.3-28.7-64-64-64z"/></svg>`,
    travel: `<svg fill="#25354c" height="50px" width="50px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
	 viewBox="0 0 122.88 122.88" xml:space="preserve">
<style type="text/css">
	.st0{fill-rule:evenodd;clip-rule:evenodd;}
</style>
<g>
	<path class="st0" d="M16.63,105.75c0.01-4.03,2.3-7.97,6.03-12.38L1.09,79.73c-1.36-0.59-1.33-1.42-0.54-2.4l4.57-3.9
		c0.83-0.51,1.71-0.73,2.66-0.47l26.62,4.5l22.18-24.02L4.8,18.41c-1.31-0.77-1.42-1.64-0.07-2.65l7.47-5.96l67.5,18.97L99.64,7.45
		c6.69-5.79,13.19-8.38,18.18-7.15c2.75,0.68,3.72,1.5,4.57,4.08c1.65,5.06-0.91,11.86-6.96,18.86L94.11,43.18l18.97,67.5
		l-5.96,7.47c-1.01,1.34-1.88,1.23-2.65-0.07L69.43,66.31L45.41,88.48l4.5,26.62c0.26,0.94,0.05,1.82-0.47,2.66l-3.9,4.57
		c-0.97,0.79-1.81,0.82-2.4-0.54l-13.64-21.57c-4.43,3.74-8.37,6.03-12.42,6.03C16.71,106.24,16.63,106.11,16.63,105.75
		L16.63,105.75z"/>
</g>
</svg>`,
    fashion: `<svg fill="#25354c" width="80px" height="80px" viewBox="-1 0 19 19" xmlns="http://www.w3.org/2000/svg" class="cf-icon-svg"><path d="m15.867 7.593-1.534.967a.544.544 0 0 1-.698-.118l-.762-.957v7.256a.476.476 0 0 1-.475.475h-7.79a.476.476 0 0 1-.475-.475V7.477l-.769.965a.544.544 0 0 1-.697.118l-1.535-.967a.387.387 0 0 1-.083-.607l2.245-2.492a2.814 2.814 0 0 1 2.092-.932h.935a2.374 2.374 0 0 0 4.364 0h.934a2.816 2.816 0 0 1 2.093.933l2.24 2.49a.388.388 0 0 1-.085.608z"/></svg>`,
    beauty: `<svg fill="#25354c" height="55px" width="55px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
	 viewBox="0 0 512 512" xml:space="preserve">
<g>
	<g>
		<path d="M410.746,200.679h-13.031V162.78H114.287v37.899h-13.031c-27.78,0-50.3,22.52-50.3,50.3V512h410.088V250.978
			C461.045,223.199,438.525,200.679,410.746,200.679z M146.212,433.291V312.48h219.576v120.81H146.212z"/>
	</g>
</g>
<g>
	<g>
		<path d="M241.421,0c0,55.002-102.059,89.165-102.059,129.234h233.276C372.639,29.826,241.421,0,241.421,0z"/>
	</g>
</g>
</svg>`,
    fitness: `<svg fill="#25354c" width="60px" height="60px" viewBox="-48 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M272 96c26.51 0 48-21.49 48-48S298.51 0 272 0s-48 21.49-48 48 21.49 48 48 48zM113.69 317.47l-14.8 34.52H32c-17.67 0-32 14.33-32 32s14.33 32 32 32h77.45c19.25 0 36.58-11.44 44.11-29.09l8.79-20.52-10.67-6.3c-17.32-10.23-30.06-25.37-37.99-42.61zM384 223.99h-44.03l-26.06-53.25c-12.5-25.55-35.45-44.23-61.78-50.94l-71.08-21.14c-28.3-6.8-57.77-.55-80.84 17.14l-39.67 30.41c-14.03 10.75-16.69 30.83-5.92 44.86s30.84 16.66 44.86 5.92l39.69-30.41c7.67-5.89 17.44-8 25.27-6.14l14.7 4.37-37.46 87.39c-12.62 29.48-1.31 64.01 26.3 80.31l84.98 50.17-27.47 87.73c-5.28 16.86 4.11 34.81 20.97 40.09 3.19 1 6.41 1.48 9.58 1.48 13.61 0 26.23-8.77 30.52-22.45l31.64-101.06c5.91-20.77-2.89-43.08-21.64-54.39l-61.24-36.14 31.31-78.28 20.27 41.43c8 16.34 24.92 26.89 43.11 26.89H384c17.67 0 32-14.33 32-32s-14.33-31.99-32-31.99z"/></svg>`,
    pets: `<svg fill="#25354c" width="60px" height="60px" viewBox="-1.5 0 19 19" xmlns="http://www.w3.org/2000/svg" class="cf-icon-svg"><path d="M4.086 7.9a1.91 1.91 0 0 1-.763 2.52c-.81.285-1.782-.384-2.17-1.492a1.91 1.91 0 0 1 .762-2.521c.81-.285 1.782.384 2.171 1.492zm6.521 7.878a2.683 2.683 0 0 1-1.903-.788.996.996 0 0 0-1.408 0 2.692 2.692 0 0 1-3.807-3.807 6.377 6.377 0 0 1 9.022 0 2.692 2.692 0 0 1-1.904 4.595zM7.73 6.057c.127 1.337-.563 2.496-1.54 2.588-.977.092-1.872-.917-1.998-2.254-.127-1.336.563-2.495 1.54-2.587.977-.093 1.871.916 1.998 2.253zm.54 0c-.127 1.337.563 2.496 1.54 2.588.977.092 1.871-.917 1.998-2.254.127-1.336-.563-2.495-1.54-2.587-.977-.093-1.872.916-1.998 2.253zm3.644 1.842a1.91 1.91 0 0 0 .763 2.522c.81.284 1.782-.385 2.17-1.493a1.91 1.91 0 0 0-.762-2.521c-.81-.285-1.782.384-2.171 1.492z"/></svg>`,
    "food and drink": `<svg fill="#25354c" width="60px" height="60px" viewBox="0 -3.84 122.88 122.88" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"  style="enable-background:new 0 0 122.88 115.21" xml:space="preserve">

<g>

<path d="M29.03,100.46l20.79-25.21l9.51,12.13L41,110.69C33.98,119.61,20.99,110.21,29.03,100.46L29.03,100.46z M53.31,43.05 c1.98-6.46,1.07-11.98-6.37-20.18L28.76,1c-2.58-3.03-8.66,1.42-6.12,5.09L37.18,24c2.75,3.34-2.36,7.76-5.2,4.32L16.94,9.8 c-2.8-3.21-8.59,1.03-5.66,4.7c4.24,5.1,10.8,13.43,15.04,18.53c2.94,2.99-1.53,7.42-4.43,3.69L6.96,18.32 c-2.19-2.38-5.77-0.9-6.72,1.88c-1.02,2.97,1.49,5.14,3.2,7.34L20.1,49.06c5.17,5.99,10.95,9.54,17.67,7.53 c1.03-0.31,2.29-0.94,3.64-1.77l44.76,57.78c2.41,3.11,7.06,3.44,10.08,0.93l0.69-0.57c3.4-2.83,3.95-8,1.04-11.34L50.58,47.16 C51.96,45.62,52.97,44.16,53.31,43.05L53.31,43.05z M65.98,55.65l7.37-8.94C63.87,23.21,99-8.11,116.03,6.29 C136.72,23.8,105.97,66,84.36,55.57l-8.73,11.09L65.98,55.65L65.98,55.65z"/>

</g>

</svg>`,
    electronics: `<svg height="60px" width="60px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
	 viewBox="0 0 512 512"  xml:space="preserve">
<style type="text/css">
	.st0{fill:#25354c;}
</style>
<g>
	<path class="st0" d="M511.275,335.864c-13.696-182.839-84.68-268.054-158.186-268.054c-55.32,0-73.124,39.474-97.088,39.474
		c-23.964,0-41.824-39.474-97.089-39.474c-73.505,0-144.49,85.216-158.186,268.054c-5.225,57.878,18.231,94.731,56.036,105.86
		c38.222,11.256,84.926-16.545,123.429-72.472c17.151-24.925,46.267-58.459,75.81-58.459c29.542,0,58.658,33.534,75.81,58.459
		c38.504,55.927,85.206,83.728,123.428,72.472C493.053,430.595,516.5,393.742,511.275,335.864z M198.694,252.418h-37.116v37.116
		H120.87v-37.116H83.755v-40.708h37.115v-37.115h40.708v37.115h37.116V252.418z M321.914,257.768c-11.864,0-21.47-9.596-21.47-21.46
		c0-11.855,9.606-21.461,21.47-21.461c11.854,0,21.47,9.606,21.47,21.461C343.384,248.172,333.769,257.768,321.914,257.768z
		 M373.77,309.642c-11.846,0-21.452-9.606-21.452-21.469c0-11.855,9.606-21.461,21.452-21.461c11.864,0,21.469,9.606,21.469,21.461
		C395.239,300.036,385.633,309.642,373.77,309.642z M373.77,205.904c-11.846,0-21.452-9.614-21.452-21.469
		c0-11.864,9.606-21.469,21.452-21.469c11.864,0,21.469,9.606,21.469,21.469C395.239,196.29,385.633,205.904,373.77,205.904z
		 M425.642,257.768c-11.854,0-21.469-9.596-21.469-21.46c0-11.855,9.615-21.461,21.469-21.461c11.865,0,21.469,9.606,21.469,21.461
		C447.111,248.172,437.507,257.768,425.642,257.768z"/>
</g>
</svg>`,
    books: `<svg fill="#25354c" width="60px" height="60px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
<title>book</title>
<path d="M15 25.875v-19.625c0 0-2.688-2.25-6.5-2.25s-6.5 2-6.5 2v19.875c0 0 2.688-1.938 6.5-1.938s6.5 1.938 6.5 1.938zM29 25.875v-19.625c0 0-2.688-2.25-6.5-2.25s-6.5 2-6.5 2v19.875c0 0 2.688-1.938 6.5-1.938s6.5 1.938 6.5 1.938zM31 8h-1v19h-12v1h-5v-1h-12v-19h-1v20h12v1h7.062l-0.062-1h12v-20z"></path>
</svg>`
  };

  storeCards.forEach(card => {
    const categories = (card.dataset.storeCategory || "").split(",");
    const firstCategory = categories[0]?.trim().toLowerCase().replace(/&/g, "and");

    const iconHtml = categoryIcons[firstCategory];

    const embedDiv = card.querySelector(".code-embed-18");
    if (embedDiv && iconHtml) {
      embedDiv.innerHTML = iconHtml;
    }
  });
};

function initAllStoreScripts(scope = document) {
  // console.log("✅ Running initAllStoreScripts");
  initCMSDealURLs(scope);
  initSaleTypeColors(scope);
  initSaleTypeAttributes(scope);
  initStoreCategoryIcons(scope);
  initFavouriteStars(scope);
}

document.addEventListener("DOMContentLoaded", () => {
  const cmsList = document.querySelector('[fs-cmsload-element="list"]');
  if (!cmsList) return;
  
  initAllStoreScripts(cmsList);

  const observer = new MutationObserver((mutations) => {
  mutations.forEach(m => {
    m.addedNodes.forEach(n => {
      if (n.nodeType === 1 && n.classList.contains('w-dyn-item')) {
        initAllStoreScripts(n); // Reapply custom logic

        // ✅ Rebind modal for newly added node
        // console.log("Rebinding modal to new items (forced)...");
				window.fsAttributes?.trigger?.('modal');
      }
    });
  });
});


  observer.observe(cmsList, { childList: true, subtree: true });
});

window.fsAttributes = window.fsAttributes || [];
window.fsAttributes.push([
  'cmsload',
  (listInstances) => {
    listInstances.forEach(instance => {
      const list = instance.list;
      const items = Array.from(list.children);

      // Separate items with and without an image
      const itemsWithImage = [];
      const itemsWithoutImage = [];

      items.forEach(item => {
        const img = item.querySelector("img");
        if (img && img.src && !img.src.includes("placeholder") && img.src.trim() !== "") {
          itemsWithImage.push(item);
        } else {
          itemsWithoutImage.push(item);
        }
      });

      // Fisher-Yates shuffle
      function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
      }

      shuffle(itemsWithImage);
      shuffle(itemsWithoutImage);

      const combined = [...itemsWithImage, ...itemsWithoutImage];

      combined.forEach(item => list.appendChild(item));
    });

    console.log("✅ Shuffled CMS items — image-first preference");
  }
]);

  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
      document.querySelectorAll(".fade-on-load").forEach(el => {
        el.style.opacity = "1";
      });
    }, 1500); // Delay in ms — adjust if needed
  });


function initSaleTypeAttributes(scope = document) {
  const cards = scope.matches?.('.store-card') ? [scope] : scope.querySelectorAll('.store-card');

  $(cards).each(function () {
    const $card = $(this);
    const storeDealType = $card.find('.data-store-deal').attr('data-deal-type');
    $card.attr("data-store-sale-type", storeDealType);
  });
}

  window.fsAttributes = window.fsAttributes || [];
  window.fsAttributes.push([
    'cmsload',
    (listInstances) => {
      listInstances.forEach(instance => {
        const list = instance.list;
        // 👇 Re-run your sale type mapping once items are fully loaded
        initSaleTypeAttributes(list);
      });

      console.log("✅ Sale types initialized after CMSLoad");
    }
  ]);

document.addEventListener("DOMContentLoaded", function () {
  let activeCategory = null;
  let activeSaleTypes = new Set();
  let showOnlyFavourites = false;

  const normalize = str =>
    (str || "")
      .trim()
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/\s+/g, " ");

  const favouritestores = () => window.favouritestores || [];

  // CATEGORY FILTER
  document.querySelectorAll(".div-block-152").forEach(button => {
    button.addEventListener("click", function () {
      const selected = this.dataset.category;
      const isActive = activeCategory === selected;

      document.querySelectorAll(".div-block-152").forEach(btn =>
        btn.classList.remove("active-filter")
      );

      activeCategory = isActive ? null : selected;

      if (!isActive) this.classList.add("active-filter");

      filterStoreCards();
    });
  });

  // SALE TYPE FILTERS
  document.querySelectorAll(".sale-type-filter").forEach(button => {
    button.addEventListener("click", function () {
      const selectedType = this.dataset.saleType;

      if (this.classList.contains("active-sale-type")) {
        this.classList.remove("active-sale-type");
        activeSaleTypes.delete(selectedType);
      } else {
        this.classList.add("active-sale-type");
        activeSaleTypes.add(selectedType);
      }

      filterStoreCards();
    });
  });

  // FAVOURITES FILTER
  const favToggle = document.querySelector(".div-block-144");
  if (favToggle) {
    favToggle.addEventListener("click", () => {
      showOnlyFavourites = !showOnlyFavourites;
      favToggle.classList.toggle("favourites-active", showOnlyFavourites);
      filterStoreCards();
    });
  }

  // COMBINED FILTER LOGIC
  window.filterStoreCards = function () {
    const normalizedCategory = normalize(activeCategory);
    const saleTypes = Array.from(activeSaleTypes).map(normalize);

    document.querySelectorAll(".store-card").forEach(card => {
      const slug = card.getAttribute("data-store-slug");
      const cardSaleType = (card.dataset.storeSaleType || "").toLowerCase();
      const cardCategories = (card.dataset.storeCategory || "").split(",").map(normalize);
      const isFavourited = favouritestores().includes(slug);

      const matchCategory = !normalizedCategory || cardCategories.includes(normalizedCategory);
      const matchSaleType = saleTypes.length === 0 || saleTypes.includes(cardSaleType);
      const matchFavourites = !showOnlyFavourites || isFavourited;

      const shouldShow = matchCategory && matchSaleType && matchFavourites;
      card.parentElement.style.display = shouldShow ? "" : "none";
    });
  };
});

  document.addEventListener("DOMContentLoaded", function () {
    const scanningText = document.querySelector(".scanning-text");

    if (scanningText) {
      // Wait 1.5s, then start fade-out in the next animation frame
      setTimeout(() => {
        requestAnimationFrame(() => {
          scanningText.style.opacity = "0";

          // Remove element after fade-out completes (0.5s)
          setTimeout(() => scanningText.remove(), 500);
        });
      }, 1500);
    }
  });

let scrollYBeforeModal = 0;

function disableScrollLock() {
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);

  if (isMobile) {
    document.body.style.overflow = 'hidden';
  } else {
    scrollYBeforeModal = window.scrollY || window.pageYOffset;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollYBeforeModal}px`;
    document.body.style.width = '100%';
  }
}

function enableScrollLock() {
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);

  if (isMobile) {
    document.body.style.overflow = '';
  } else {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, scrollYBeforeModal);
  }
}
  
  const rewardsznSubscriptionPlans = {
    'pln_basic-plan-t16v0tq1': 'Basic',
    'pln_plus-plan-4u8i0qu5': 'Plus',
    'pln_premium-plan-g96w0t1t': 'Premium',
    'pln_ultimate-plan-v46x0thq': 'Ultimate'
  };

  document.addEventListener("DOMContentLoaded", async () => {
    try {
      const rewardsznMemberData = await window.$memberstackDom.getCurrentMember();
      const rewardsznCustomFields = rewardsznMemberData?.data?.customFields;
      const rewardsznState = rewardsznCustomFields?.['country-state'];
      const rewardsznPlans = rewardsznMemberData?.data?.planConnections || [];

      console.log("rewardsznState is " + rewardsznState);

      // State-based exclusion
      if (rewardsznState && giveawayExclude.includes(rewardsznState.toUpperCase())) {
        console.log("You can't enter this draw");
        const entryBlock = document.getElementById("sum-entry-result-block");
        const excludedNotice = document.getElementById("your-state-excluded");

        if (entryBlock) entryBlock.style.display = "none";
        if (excludedNotice) {
          excludedNotice.style.display = "block";
          excludedNotice.innerText = `${rewardsznState.toUpperCase()} residents excluded.`;
        }
      }

      // Active subscription detection
      const rewardsznActiveSubscription = rewardsznPlans.find(plan =>
        plan.status?.toLowerCase() === "active" &&
        rewardsznSubscriptionPlans.hasOwnProperty(plan.planId)
      );

      if (!rewardsznActiveSubscription) {
        console.log("No active subscription found");
        const hideAccumEntries = document.getElementById("hide-accum-entries");
        hideAccumEntries.style.display = "flex";
        document.getElementById("edit-plan").style.display = "none";
        document.getElementById("unlock-plan").style.display = "flex";
      } else {
        const planName = rewardsznSubscriptionPlans[rewardsznActiveSubscription.planId];
        console.log(`${planName} subscription is active`);
      }
    } catch (error) {
      console.error("Error in RewardSZN state + subscription check:", error);
    }        
  });

// document.addEventListener("DOMContentLoaded", async () => {
//   const memberData = await window.$memberstackDom.getCurrentMember();
  
//   if (!memberData) return;

//   const user = memberData.data;
//   const isEmailVerified = user.emailVerified;
//   const userPlans = user.planConnections || [];

//   const isFreePlan = userPlans.some(plan => 
//     plan.planId === "pln_free-account-evqe0etk" && plan.status === "ACTIVE"
//   );

//   if (isFreePlan && !isEmailVerified) {
//     // User is on free plan and has NOT verified their email
//    document.getElementById("hide-if-not-verified").style.display = "none";
//    document.getElementById("hide-if-not-verified-tabs").style.display = "none";
//    document.getElementById("verify-email-block").style.display = "flex"; // or show a modal/gate
//   }
//   // Otherwise, allow access
// });
