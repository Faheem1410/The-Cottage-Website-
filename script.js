  const heroVideo = document.querySelector('.hero-video');
  if (heroVideo) {
    heroVideo.play().catch(() => {});
  }

  const tabs = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('panel-' + tab.dataset.tab).classList.add('active');
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  const SUPABASE_URL = 'https://mlslqjwzdaginxlxadjw.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sc2xxand6ZGFnaW54bHhhZGp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxMjIxODQsImV4cCI6MjEwMjY5ODE4NH0.hn42RtE0_6ad3fXPnAXtNRiJjV4WGjIkzRWVS_qJd78';

  const enquiryForm = document.getElementById('enquiry-form');
  const enquiryStatus = document.getElementById('enquiry-status');
  if (enquiryForm) {
    enquiryForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = enquiryForm.querySelector('button[type="submit"]');
      const name = enquiryForm.name.value;
      const email = enquiryForm.email.value;
      const message = enquiryForm.message.value;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      try {
        const res = await fetch(SUPABASE_URL + '/rest/v1/enquiries', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_KEY,
            'Authorization': 'Bearer ' + SUPABASE_KEY,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({ name, email, message })
        });

        if (!res.ok) throw new Error('Request failed');

        enquiryForm.reset();
        enquiryStatus.textContent = "Thanks, " + name + " — we've received your message and will be in touch soon.";
        submitBtn.textContent = 'Sent';
      } catch (err) {
        enquiryStatus.textContent = "Something went wrong sending that — please email us directly at Events@thecottageinfo.com.";
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }
    });
  }

  const bookingOverlay = document.getElementById('booking-overlay');
  const openBookingBtn = document.getElementById('open-booking');

  if (bookingOverlay && openBookingBtn) {
    const closeBookingBtn = document.getElementById('booking-close');

    function openBooking() {
      bookingOverlay.hidden = false;
      document.body.style.overflow = 'hidden';
      goToStep(1);
    }
    function closeBooking() {
      bookingOverlay.hidden = true;
      document.body.style.overflow = '';
    }

    openBookingBtn.addEventListener('click', openBooking);
    closeBookingBtn.addEventListener('click', closeBooking);
    bookingOverlay.addEventListener('click', (e) => {
      if (e.target === bookingOverlay) closeBooking();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !bookingOverlay.hidden) closeBooking();
    });

    // Mini calendar
    const calGrid = document.getElementById('cal-grid');
    const calMonthLabel = document.getElementById('cal-month-label');
    const calPrev = document.getElementById('cal-prev');
    const calNext = document.getElementById('cal-next');
    const selectedDateText = document.getElementById('selected-date-text');

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let viewYear = today.getFullYear();
    let viewMonth = today.getMonth();
    let selectedDate = null;

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    function formatDate(d) {
      return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    }

    function renderCalendar() {
      calMonthLabel.textContent = monthNames[viewMonth] + ' ' + viewYear;
      calGrid.innerHTML = '';
      const firstDay = new Date(viewYear, viewMonth, 1).getDay();
      const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

      for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement('span');
        empty.className = 'cal-day is-empty';
        calGrid.appendChild(empty);
      }

      for (let d = 1; d <= daysInMonth; d++) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'cal-day';
        btn.textContent = String(d);
        const thisDate = new Date(viewYear, viewMonth, d);

        if (thisDate < today) {
          btn.disabled = true;
        } else {
          btn.addEventListener('click', () => {
            selectedDate = thisDate;
            selectedDateText.textContent = formatDate(thisDate);
            calGrid.querySelectorAll('.cal-day.selected').forEach((el) => el.classList.remove('selected'));
            btn.classList.add('selected');
          });
        }
        if (selectedDate && thisDate.getTime() === selectedDate.getTime()) {
          btn.classList.add('selected');
        }
        calGrid.appendChild(btn);
      }
    }

    calPrev.addEventListener('click', () => {
      viewMonth--;
      if (viewMonth < 0) { viewMonth = 11; viewYear--; }
      renderCalendar();
    });
    calNext.addEventListener('click', () => {
      viewMonth++;
      if (viewMonth > 11) { viewMonth = 0; viewYear++; }
      renderCalendar();
    });
    renderCalendar();

    // "Other" function type reveal
    const functionSelect = document.getElementById('b-function');
    const functionOtherWrap = document.getElementById('function-other-wrap');
    functionSelect.addEventListener('change', () => {
      functionOtherWrap.hidden = functionSelect.value !== 'Other';
    });

    // Food yes/no reveal
    const foodDetails = document.getElementById('food-details');
    document.querySelectorAll('input[name="food"]').forEach((radio) => {
      radio.addEventListener('change', () => {
        foodDetails.hidden = !document.getElementById('food-yes').checked;
      });
    });

    // Room video preview
    const roomSelect = document.getElementById('b-room');
    const roomVideo = document.getElementById('room-video');
    const roomVideoSource = document.getElementById('room-video-source');
    const roomVideoCaption = document.getElementById('room-video-caption');
    roomSelect.addEventListener('change', () => {
      const chosen = roomSelect.options[roomSelect.selectedIndex];
      const videoFile = chosen ? chosen.dataset.video : null;
      if (videoFile) {
        roomVideoSource.src = videoFile;
        roomVideo.load();
        roomVideoCaption.textContent = chosen.textContent;
      } else {
        roomVideo.pause();
        roomVideoSource.src = '';
        roomVideo.load();
        roomVideoCaption.textContent = 'Pick a room to see a quick video of the space';
      }
    });

    // Step navigation
    const steps = Array.from(document.querySelectorAll('.booking-step'));
    const progressSteps = Array.from(document.querySelectorAll('.booking-progress-step'));
    const bookingStatus = document.getElementById('booking-status');

    function goToStep(stepNum) {
      steps.forEach((s) => s.classList.toggle('active', Number(s.dataset.step) === stepNum));
      progressSteps.forEach((p) => {
        const n = Number(p.dataset.step);
        p.classList.toggle('active', n === stepNum);
        p.classList.toggle('completed', n < stepNum);
      });
      bookingOverlay.scrollTop = 0;
    }

    function validateStep(stepNum) {
      const stepEl = steps.find((s) => Number(s.dataset.step) === stepNum);
      const requiredFields = Array.from(stepEl.querySelectorAll('input[required], select[required]'));
      for (const field of requiredFields) {
        if (!field.checkValidity()) {
          field.reportValidity();
          return false;
        }
      }
      if (stepNum === 1 && !selectedDate) {
        bookingStatus.textContent = 'Please select a date from the calendar.';
        return false;
      }
      if (stepNum === 1) bookingStatus.textContent = '';
      return true;
    }

    document.querySelectorAll('.booking-next').forEach((btn) => {
      btn.addEventListener('click', () => {
        const currentStep = Number(btn.closest('.booking-step').dataset.step);
        if (validateStep(currentStep)) {
          goToStep(Number(btn.dataset.next));
        }
      });
    });
    document.querySelectorAll('.booking-back').forEach((btn) => {
      btn.addEventListener('click', () => {
        goToStep(Number(btn.dataset.back));
      });
    });

    // Submit
    const bookingForm = document.getElementById('booking-form');

    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!selectedDate) {
        bookingStatus.textContent = 'Please select a date from the calendar.';
        return;
      }

      const submitBtn = document.getElementById('booking-submit');
      const name = document.getElementById('b-name').value;
      const email = document.getElementById('b-email').value;
      const guests = document.getElementById('b-guests').value;
      let functionType = functionSelect.value;
      const functionOther = document.getElementById('b-function-other').value.trim();
      if (functionType === 'Other' && functionOther) functionType = functionOther;
      const room = document.getElementById('b-room').value;
      const session = document.getElementById('b-session').value;
      const foodWanted = document.getElementById('food-yes').checked;
      const notes = document.getElementById('b-notes').value.trim();

      const messageLines = [
        'VENUE ENQUIRY',
        'Preferred date: ' + formatDate(selectedDate),
        'Guests: ' + guests,
        'Function type: ' + functionType,
        'Room: ' + room,
        'Session: ' + session,
        'Food included: ' + (foodWanted ? 'Yes' : 'No')
      ];

      if (foodWanted) {
        const starters = Array.from(document.querySelectorAll('input[name="starter"]:checked')).map((i) => i.value);
        const starterOther = document.getElementById('starter-other').value.trim();
        if (starterOther) starters.push(starterOther);
        const mains = Array.from(document.querySelectorAll('input[name="main"]:checked')).map((i) => i.value);
        const mainOther = document.getElementById('main-other').value.trim();
        if (mainOther) mains.push(mainOther);
        const dessert = document.getElementById('dessert-notes').value.trim();

        messageLines.push('Starters: ' + (starters.length ? starters.join(', ') : 'Not specified'));
        messageLines.push('Mains: ' + (mains.length ? mains.join(', ') : 'Not specified'));
        messageLines.push('Dessert preferences: ' + (dessert || 'Not specified'));
      }

      if (notes) messageLines.push('Additional notes: ' + notes);

      const message = messageLines.join('\n');

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      bookingStatus.textContent = '';

      try {
        const res = await fetch(SUPABASE_URL + '/rest/v1/enquiries', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_KEY,
            'Authorization': 'Bearer ' + SUPABASE_KEY,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({ name, email, message })
        });

        if (!res.ok) throw new Error('Request failed');

        bookingStatus.textContent = "Thanks, " + name + " — we've received your enquiry and will be in touch soon.";
        submitBtn.textContent = 'Sent';
      } catch (err) {
        bookingStatus.textContent = "Something went wrong sending that — please email us directly at Events@thecottageinfo.com.";
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send enquiry';
      }
    });
  }

  const reservationOverlay = document.getElementById('reservation-overlay');
  const openReservationBtn = document.getElementById('open-reservation');

  if (reservationOverlay && openReservationBtn) {
    const reservationClose = document.getElementById('reservation-close');

    function openReservation() {
      reservationOverlay.hidden = false;
      document.body.style.overflow = 'hidden';
      goToResStep(1);
    }
    function closeReservation() {
      reservationOverlay.hidden = true;
      document.body.style.overflow = '';
    }

    openReservationBtn.addEventListener('click', openReservation);
    reservationClose.addEventListener('click', closeReservation);
    reservationOverlay.addEventListener('click', (e) => {
      if (e.target === reservationOverlay) closeReservation();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !reservationOverlay.hidden) closeReservation();
    });

    // Mini calendar (reservation)
    const resCalGrid = document.getElementById('res-cal-grid');
    const resCalMonthLabel = document.getElementById('res-cal-month-label');
    const resCalPrev = document.getElementById('res-cal-prev');
    const resCalNext = document.getElementById('res-cal-next');
    const resSelectedDateText = document.getElementById('res-selected-date-text');

    const resToday = new Date();
    resToday.setHours(0, 0, 0, 0);
    let resViewYear = resToday.getFullYear();
    let resViewMonth = resToday.getMonth();
    let resSelectedDate = null;

    const resMonthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    function formatResDate(d) {
      return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    }

    function renderResCalendar() {
      resCalMonthLabel.textContent = resMonthNames[resViewMonth] + ' ' + resViewYear;
      resCalGrid.innerHTML = '';
      const firstDay = new Date(resViewYear, resViewMonth, 1).getDay();
      const daysInMonth = new Date(resViewYear, resViewMonth + 1, 0).getDate();

      for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement('span');
        empty.className = 'cal-day is-empty';
        resCalGrid.appendChild(empty);
      }

      for (let d = 1; d <= daysInMonth; d++) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'cal-day';
        btn.textContent = String(d);
        const thisDate = new Date(resViewYear, resViewMonth, d);

        if (thisDate < resToday) {
          btn.disabled = true;
        } else {
          btn.addEventListener('click', () => {
            resSelectedDate = thisDate;
            resSelectedDateText.textContent = formatResDate(thisDate);
            resCalGrid.querySelectorAll('.cal-day.selected').forEach((el) => el.classList.remove('selected'));
            btn.classList.add('selected');
          });
        }
        if (resSelectedDate && thisDate.getTime() === resSelectedDate.getTime()) {
          btn.classList.add('selected');
        }
        resCalGrid.appendChild(btn);
      }
    }

    resCalPrev.addEventListener('click', () => {
      resViewMonth--;
      if (resViewMonth < 0) { resViewMonth = 11; resViewYear--; }
      renderResCalendar();
    });
    resCalNext.addEventListener('click', () => {
      resViewMonth++;
      if (resViewMonth > 11) { resViewMonth = 0; resViewYear++; }
      renderResCalendar();
    });
    renderResCalendar();

    // Time slots: 9:00am to 3:00pm, every 15 minutes
    const timeSelect = document.getElementById('r-time');
    (function populateTimeSlots() {
      for (let mins = 9 * 60; mins <= 15 * 60; mins += 15) {
        const h24 = Math.floor(mins / 60);
        const m = mins % 60;
        const period = h24 < 12 ? 'AM' : 'PM';
        let h12 = h24 % 12;
        if (h12 === 0) h12 = 12;
        const label = h12 + ':' + String(m).padStart(2, '0') + ' ' + period;
        const opt = document.createElement('option');
        opt.value = label;
        opt.textContent = label;
        timeSelect.appendChild(opt);
      }
    })();

    // Pre-order yes/no reveal
    const cartWrap = document.getElementById('cart-wrap');
    document.querySelectorAll('input[name="preorder"]').forEach((radio) => {
      radio.addEventListener('change', () => {
        cartWrap.hidden = !document.getElementById('preorder-yes').checked;
      });
    });

    // Menu data + cart — mirrors every section of the printed menu (cottage-full-menu.pdf)
    const MENU_ITEMS = {
      englishBreakfast: [
        { name: 'Cottage House Breakfast', price: 12.00 },
        { name: 'Full English Breakfast', price: 12.00 },
        { name: 'Country Breakfast', price: 12.80 },
        { name: 'Veggie Breakfast', price: 9.20 }
      ],
      desiBreakfast: [
        { name: 'Keema Nashta', price: 13.00 },
        { name: 'Omelette Nashta', price: 9.60 },
        { name: 'Veggie Nashta', price: 10.00 },
        { name: 'Paratha Wrap — Omelette', price: 4.80 },
        { name: 'Paratha Wrap — Chicken and Cheese', price: 6.00 },
        { name: 'Paratha Wrap — Turkey Rashers and Egg', price: 6.40 },
        { name: 'Paratha Wrap — Keema, Egg and Cheese', price: 8.00 }
      ],
      americanBreakfast: [
        { name: 'Americana', price: 12.00 },
        { name: 'Sunny Stack', price: 9.60 },
        { name: 'Croissant Delight', price: 8.50 },
        { name: 'Garden Delight', price: 8.00 }
      ],
      burgers: [
        { name: 'Cottage Drip Burger', price: 7.60 },
        { name: 'Cheese Burger', price: 7.50 },
        { name: 'Veggie Burger', price: 5.20 },
        { name: 'Desi Donner Burger', price: 6.40 }
      ],
      desiParathaSando: [
        { name: 'The Signature Cottage', price: 15.00 },
        { name: 'Chicken Panini Sando', price: 15.00 },
        { name: 'The Veggie Sando', price: 12.50 }
      ],
      bagels: [
        { name: 'Egg & Turkey Rasher Bagel', price: 5.00 },
        { name: 'Keema & Cheese Bagel', price: 4.00 },
        { name: 'Donner & Cheese Bagel', price: 5.00 },
        { name: 'Chicken Perini and Cheese Bagel', price: 5.00 }
      ],
      loadedFries: [
        { name: 'Chicken Perini & Cheese Loaded Fries', price: 5.60 },
        { name: 'Keema & Cheese Loaded Fries', price: 5.60 },
        { name: 'Donner & Cheese Loaded Fries', price: 6.40 },
        { name: 'Desi Donner & Cheese Loaded Fries', price: 6.80 }
      ],
      jacketPotato: [
        { name: 'Beans / Masala Beans & Cheese Jacket Potato', price: 6.00 },
        { name: 'Tuna Mayo and Cheese Jacket Potato', price: 6.00 },
        { name: 'Tuna Mayo, Cheese & Sweetcorn Jacket Potato', price: 6.80 },
        { name: 'Chicken Perini, Cheese and Beans Jacket Potato', price: 7.20 },
        { name: 'Keema and Cheese Jacket Potato', price: 7.20 },
        { name: 'Desi Donner and Cheese Jacket Potato', price: 7.20 }
      ],
      sandwiches: [
        { name: 'Club Sandwich', price: 7.60 },
        { name: 'Veggie Club', price: 6.00 },
        { name: 'Salad Bowl', price: 6.50 }
      ],
      toastiesPaninis: [
        { name: 'Cheese And Tomato Toastie', price: 5.00 },
        { name: 'Chicken Toastie', price: 5.00 },
        { name: 'Keema Bhuna Toastie', price: 6.00 },
        { name: 'Chicken Perini Toastie', price: 6.00 },
        { name: 'Tuna Mayo Toastie', price: 5.00 },
        { name: 'Tuna Sweetcorn Toastie', price: 5.00 },
        { name: 'Sausage Toastie', price: 5.00 },
        { name: 'Turkey Rashers Toastie', price: 5.00 },
        { name: 'Desi Donner Toastie', price: 6.00 }
      ],
      desserts: [
        { name: 'French Toast', price: 6.50 },
        { name: 'Croffle', price: 6.50 },
        { name: 'Croissant', price: 5.00 },
        { name: 'Pancake', price: 5.00 },
        { name: 'Brownie', price: 5.00 },
        { name: 'Choco Paratha', price: 5.00 },
        { name: 'Waffle', price: 6.50 }
      ],
      kidsMeals: [
        { name: 'Chicken Nuggets and Chips', price: 4.50 },
        { name: 'Popcorn Chicken and Chips', price: 4.50 },
        { name: 'Chicken Burger and Fries', price: 5.00 }
      ],
      sides: [
        { name: 'Peri Fries', price: 2.50 },
        { name: 'Popcorn Chicken', price: 3.50 },
        { name: 'Chicken Strips', price: 4.00 },
        { name: 'BBQ Strips', price: 4.50 },
        { name: 'Spicy Strips', price: 5.00 },
        { name: 'Naga Strips', price: 5.00 },
        { name: 'Coleslaw', price: 1.00 },
        { name: 'Fresh Salad', price: 2.00 },
        { name: 'Chicken Nuggets', price: 4.00 },
        { name: 'Chilli Cheese Bites', price: 4.00 },
        { name: 'Mozzarella Sticks', price: 3.00 },
        { name: 'Potato Wedges', price: 2.00 },
        { name: 'Onion Rings', price: 2.00 },
        { name: 'Sauteed Potatoes', price: 2.00 },
        { name: 'French Fries', price: 2.00 }
      ],
      hotDrinks: [
        { name: 'Tea', price: 1.95 },
        { name: 'Coffee', price: 2.80 },
        { name: 'Hot Chocolate', price: 2.80 }
      ],
      icedDrinks: [
        { name: 'Iced Tea / Latte / Spanish / Vanilla / Caramel / Pistachio / Mocha', price: 3.75 },
        { name: 'Matcha', price: 4.00 },
        { name: 'Blondie Special / Blueberry Pie', price: 4.50 }
      ],
      softDrinks: [
        { name: 'Soft Drink (Cola / Mango / Lemon / Passionfruit / Guava / Orange / Fruit Shoot / Water)', price: 2.00 },
        { name: 'Red Bull / J20', price: 3.00 }
      ],
      mocktails: [
        { name: 'Mocktail (Strawberry Crush / Blue Lagoon / Mango Delight / Mint Mojito / Strawberry Passion)', price: 4.95 }
      ]
    };
    const CATEGORY_LABELS = {
      englishBreakfast: 'English Breakfast',
      desiBreakfast: 'Desi Breakfast',
      americanBreakfast: 'American Breakfast',
      burgers: 'Burgers',
      desiParathaSando: 'Desi Paratha Sando',
      bagels: 'Bagels',
      loadedFries: 'Loaded Fries',
      jacketPotato: 'Jacket Potato',
      sandwiches: 'Sandwiches',
      toastiesPaninis: 'Toasties / Paninis',
      desserts: 'Desserts',
      kidsMeals: 'Kids Meals',
      sides: 'Sides',
      hotDrinks: 'Hot Drinks',
      icedDrinks: 'Iced Drinks',
      softDrinks: 'Soft Drinks',
      mocktails: 'Mocktails'
    };

    const cart = {};
    let activeCategory = 'englishBreakfast';

    const cartTabsEl = document.getElementById('cart-tabs');
    const cartItemsEl = document.getElementById('cart-items');
    const cartEmptyMsg = document.getElementById('cart-empty-msg');
    const cartSummaryList = document.getElementById('cart-summary-list');
    const cartTotalRow = document.getElementById('cart-total-row');
    const cartTotalEl = document.getElementById('cart-total');

    function money(n) { return '£' + n.toFixed(2); }

    function findItemPrice(name) {
      for (const cat of Object.keys(MENU_ITEMS)) {
        const found = MENU_ITEMS[cat].find((i) => i.name === name);
        if (found) return found.price;
      }
      return 0;
    }

    function renderCartTabs() {
      cartTabsEl.innerHTML = '';
      Object.keys(MENU_ITEMS).forEach((cat) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'cart-tab-btn' + (cat === activeCategory ? ' active' : '');
        btn.textContent = CATEGORY_LABELS[cat];
        btn.addEventListener('click', () => {
          activeCategory = cat;
          renderCartTabs();
          renderCartItems();
        });
        cartTabsEl.appendChild(btn);
      });
    }

    function renderCartItems() {
      cartItemsEl.innerHTML = '';
      MENU_ITEMS[activeCategory].forEach((item) => {
        const qty = cart[item.name] || 0;
        const row = document.createElement('div');
        row.className = 'cart-item-row';
        row.innerHTML =
          '<div class="cart-item-info"><span class="cart-item-name">' + item.name + '</span>' +
          '<span class="cart-item-price">' + money(item.price) + '</span></div>' +
          '<div class="cart-item-stepper">' +
          '<button type="button" class="cart-qty-btn" data-action="dec">&minus;</button>' +
          '<span class="cart-qty-value">' + qty + '</span>' +
          '<button type="button" class="cart-qty-btn" data-action="inc">+</button>' +
          '</div>';
        row.querySelector('[data-action="dec"]').addEventListener('click', () => {
          cart[item.name] = Math.max(0, (cart[item.name] || 0) - 1);
          if (cart[item.name] === 0) delete cart[item.name];
          renderCartItems();
          renderCartSummary();
        });
        row.querySelector('[data-action="inc"]').addEventListener('click', () => {
          cart[item.name] = (cart[item.name] || 0) + 1;
          renderCartItems();
          renderCartSummary();
        });
        cartItemsEl.appendChild(row);
      });
    }

    function renderCartSummary() {
      const names = Object.keys(cart);
      cartEmptyMsg.hidden = names.length > 0;
      cartSummaryList.innerHTML = '';
      let total = 0;
      names.forEach((name) => {
        const qty = cart[name];
        const price = findItemPrice(name);
        const lineTotal = qty * price;
        total += lineTotal;
        const li = document.createElement('li');
        li.innerHTML = '<span>' + qty + ' &times; ' + name + '</span><span>' + money(lineTotal) + '</span>';
        cartSummaryList.appendChild(li);
      });
      cartTotalRow.hidden = names.length === 0;
      cartTotalEl.textContent = money(total);
    }

    renderCartTabs();
    renderCartItems();
    renderCartSummary();

    // Step navigation (reservation)
    const resSteps = Array.from(document.querySelectorAll('#reservation-overlay .booking-step'));
    const resProgressSteps = Array.from(document.querySelectorAll('#reservation-progress .booking-progress-step'));
    const reservationStatus = document.getElementById('reservation-status');

    function goToResStep(stepNum) {
      resSteps.forEach((s) => s.classList.toggle('active', Number(s.dataset.step) === stepNum));
      resProgressSteps.forEach((p) => {
        const n = Number(p.dataset.step);
        p.classList.toggle('active', n === stepNum);
        p.classList.toggle('completed', n < stepNum);
      });
      reservationOverlay.scrollTop = 0;
    }

    function validateResStep(stepNum) {
      const stepEl = resSteps.find((s) => Number(s.dataset.step) === stepNum);
      const requiredFields = Array.from(stepEl.querySelectorAll('input[required], select[required]'));
      for (const field of requiredFields) {
        if (!field.checkValidity()) {
          field.reportValidity();
          return false;
        }
      }
      if (stepNum === 1 && !resSelectedDate) {
        reservationStatus.textContent = 'Please select a date from the calendar.';
        return false;
      }
      if (stepNum === 1) reservationStatus.textContent = '';
      return true;
    }

    document.querySelectorAll('#reservation-overlay .booking-next').forEach((btn) => {
      btn.addEventListener('click', () => {
        const currentStep = Number(btn.closest('.booking-step').dataset.step);
        if (validateResStep(currentStep)) goToResStep(Number(btn.dataset.next));
      });
    });
    document.querySelectorAll('#reservation-overlay .booking-back').forEach((btn) => {
      btn.addEventListener('click', () => goToResStep(Number(btn.dataset.back)));
    });

    // Submit
    const reservationForm = document.getElementById('reservation-form');

    reservationForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!resSelectedDate) {
        reservationStatus.textContent = 'Please select a date from the calendar.';
        return;
      }

      const submitBtn = document.getElementById('reservation-submit');
      const name = document.getElementById('r-name').value;
      const phone = document.getElementById('r-phone').value;
      const time = timeSelect.value;
      const people = document.getElementById('r-people').value;
      const preorderWanted = document.getElementById('preorder-yes').checked;
      const notes = document.getElementById('r-notes').value.trim();

      const messageLines = [
        'TABLE RESERVATION',
        'Date: ' + formatResDate(resSelectedDate),
        'Time: ' + time,
        'Party size: ' + people,
        'Contact number: ' + phone,
        'Pre-order: ' + (preorderWanted ? 'Yes' : 'No')
      ];

      if (preorderWanted) {
        const names = Object.keys(cart);
        if (names.length === 0) {
          messageLines.push('Order: none selected');
        } else {
          let total = 0;
          const orderParts = names.map((n) => {
            const qty = cart[n];
            const price = findItemPrice(n);
            total += qty * price;
            return qty + 'x ' + n + ' (' + money(qty * price) + ')';
          });
          messageLines.push('Order: ' + orderParts.join(', '));
          messageLines.push('Order total: ' + money(total));
        }
      }

      if (notes) messageLines.push('Additional notes: ' + notes);

      const message = messageLines.join('\n');

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      reservationStatus.textContent = '';

      try {
        const res = await fetch(SUPABASE_URL + '/rest/v1/enquiries', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_KEY,
            'Authorization': 'Bearer ' + SUPABASE_KEY,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({ name, email: '', message })
        });

        if (!res.ok) throw new Error('Request failed');

        reservationStatus.textContent = "Thanks, " + name + " — we've received your reservation and will confirm shortly.";
        submitBtn.textContent = 'Sent';
      } catch (err) {
        reservationStatus.textContent = "Something went wrong sending that — please call us directly to reserve.";
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send reservation';
      }
    });
  }

  const whatsappFabBtn = document.getElementById('whatsapp-fab-btn');
  const whatsappFabMenu = document.getElementById('whatsapp-fab-menu');
  if (whatsappFabBtn && whatsappFabMenu) {
    whatsappFabBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      whatsappFabMenu.hidden = !whatsappFabMenu.hidden;
    });
    document.addEventListener('click', (e) => {
      if (!whatsappFabMenu.hidden && !whatsappFabMenu.contains(e.target) && e.target !== whatsappFabBtn) {
        whatsappFabMenu.hidden = true;
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') whatsappFabMenu.hidden = true;
    });
  }

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    });
  }
