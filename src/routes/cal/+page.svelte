<script lang="ts">
    import { enhance } from '$app/forms';
    import { goto } from '$app/navigation'; 
    import type { PageServerData } from './$types';

    let { data }: { data: PageServerData } = $props();

    let today = new Date();
    let currentMonth = $state(today.getMonth());
    let currentYear = $state(today.getFullYear());

    const monatsNamen = [
        "Januar", "Februar", "März", "April", "Mai", "Juni",
        "Juli", "August", "September", "Oktober", "November", "Dezember"
    ];
    const wochenTage = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

    function toLocalDateString(date: Date): string {
        const offset = date.getTimezoneOffset();
        const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
        return adjustedDate.toISOString().split('T')[0];
    }

    let eventsByDate = $derived.by(() => {
        const map: Record<string, any[]> = {};
        const eventsList = data?.events ?? [];
        for (const ev of eventsList) {
            if (ev.zeit) {
                const dateKey = toLocalDateString(new Date(ev.zeit));
                if (!map[dateKey]) map[dateKey] = [];
                map[dateKey].push(ev);
            }
        }
        return map;
    });

    let daysInMonth = $derived(new Date(currentYear, currentMonth + 1, 0).getDate());
    let startDayOfWeek = $derived(new Date(currentYear, currentMonth, 1).getDay()); 
    let adjustedStartDay = $derived(startDayOfWeek === 0 ? 6 : startDayOfWeek - 1);

    let calendarCells = $derived.by(() => {
        const cells = [];
        for (let i = 0; i < adjustedStartDay; i++) {
            cells.push({ day: null, dateString: null });
        }
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = toLocalDateString(new Date(currentYear, currentMonth, day));
            cells.push({ day, dateString: dateStr });
        }
        return cells;
    });

    function prevMonth() {
        if (currentMonth === 0) { currentMonth = 11; currentYear--; } 
        else { currentMonth--; }
    }

    function nextMonth() {
        if (currentMonth === 11) { currentMonth = 0; currentYear++; } 
        else { currentMonth++; }
    }
</script>

<nav class="top-nav">
    <h1>Vereinsmanager</h1>
    <div class="nav-links">
        {#if data?.user}
            <span class="user-badge" style="color: #E5E7EB; margin-right: 1rem;">
                Hi, {data.user.name}!
            </span>
        {/if}
        
        {#if data?.isAdmin}
            <a href="/post/new" class="nav-link">Add</a>
            <a href="/stats" class="nav-link">Statistik</a>
        {/if}
        <a href="/dash" class="nav-link">Dashboard</a>
        <a href="/cal" class="nav-link active" style="background: rgba(255, 255, 255, 0.1); color: #FFFFFF;">Calendar</a>
        
        <form method="post" action="/dash?/signOut" use:enhance style="margin: 0; display: inline;">
            <button class="nav-link" style="background: transparent; border: none; cursor: pointer; font-size: inherit;">Sign out</button>
        </form>
    </div>
</nav>

<main class="main-content">
    <div class="dashboard-heading">
        <h2>Kalenderansicht</h2>
        
        <div class="navigation-controls">
            <button class="btn btn-secondary btn-small" onclick={prevMonth}>◀</button>
            <h3 class="month-title">{monatsNamen[currentMonth]} {currentYear}</h3>
            <button class="btn btn-secondary btn-small" onclick={nextMonth}>▶</button>
        </div>
    </div>

    <div class="calendar-wrapper card">
        <div class="calendar-grid">
            {#each wochenTage as tag}
                <div class="weekday-header">{tag}</div>
            {/each}

            {#each calendarCells as cell}
                <div 
                    class="calendar-cell" 
                    class:empty={!cell.day}
                    class:clickable={cell.day}
                    onclick={() => cell.dateString && goto(`/post/new?date=${cell.dateString}`)}
                >
                    {#if cell.day}
                        <div class="cell-header">
                            <span class="day-number">{cell.day}</span>
                            <span class="add-icon">+</span>
                        </div>
                        
                        <div class="event-container">
                            {#if cell.dateString && eventsByDate[cell.dateString]}
                                {#each eventsByDate[cell.dateString] as event}
                                    <a 
                                        href="/post/{event.id}" 
                                        class="event-badge" 
                                        title={event.title}
                                        onclick={(e) => e.stopPropagation()}
                                    >
                                        {event.title}
                                    </a>
                                {/each}
                            {/if}
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
    </div>
</main>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    :global(:root) {
        --bg-main: #F3F4F6; 
        --text-primary: #1F2937;
        --text-secondary: #4B5563;
        --primary-color: #1E3A8A; 
        --primary-hover: #1E40AF;
        --card-bg: #FFFFFF;
        --border-color: #D1D5DB;
        --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        --border-radius: 4px; 
        --spacing-sm: 0.5rem;
        --spacing-md: 1rem;
        --spacing-lg: 1.5rem;
        --spacing-xl: 2rem;
        --transition: all 0.2s ease;
        --font-body: 'Inter', sans-serif;
    }

    :global(*) { box-sizing: border-box; margin: 0; padding: 0; }
    :global(body) {
        font-family: var(--font-body);
        color: var(--text-primary);
        background-color: var(--bg-main);
        line-height: 1.5;
    }

    h1, h2, h3 { font-family: var(--font-body); font-weight: 600; color: var(--text-primary); }
    
    .top-nav {
        background: var(--primary-color);
        padding: var(--spacing-md) var(--spacing-xl);
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: var(--shadow-sm);
        position: sticky;
        top: 0;
        z-index: 100;
        border-bottom: 2px solid #172554;
    }
    .top-nav h1 { margin: 0; color: #FFFFFF; font-size: 1.5rem; }
    .nav-links { display: flex; gap: var(--spacing-md); align-items: center; }
    .nav-link { color: #E5E7EB; font-family: var(--font-body); font-weight: 500; padding: 6px 12px; border-radius: var(--border-radius); transition: var(--transition); text-decoration: none;}
    .nav-link:hover { background: rgba(255, 255, 255, 0.1); color: #FFFFFF; }
    .user-badge { font-size: 0.9em; font-weight: 500; display: flex; align-items: center; }

    .main-content {
        flex: 1;
        max-width: 1200px; /* Increased slightly to prevent squeeze on standard monitors */
        margin: 0 auto;
        width: 100%;
        padding: var(--spacing-xl);
    }

    .dashboard-heading { 
        display: flex; 
        justify-content: space-between; 
        align-items: center; 
        margin-bottom: var(--spacing-lg);
    }
    .navigation-controls { display: flex; align-items: center; gap: var(--spacing-md); }
    .month-title { min-width: 180px; text-align: center; font-size: 1.5rem; margin: 0; }

    .btn {
        display: inline-flex; align-items: center; justify-content: center;
        padding: 8px 16px; font-size: 0.9rem; font-weight: 500; font-family: var(--font-body);
        cursor: pointer; border: 1px solid transparent; border-radius: var(--border-radius);
        transition: var(--transition); background: var(--primary-color); color: #FFFFFF;
    }
    .btn-secondary { background: transparent; color: var(--primary-color); border: 2px solid var(--primary-color); }
    .btn-secondary:hover { background: rgba(30, 58, 138, 0.05); color: var(--primary-hover); }
    .btn-small { padding: 6px 12px; font-size: 1rem; }

    .card { background: var(--card-bg); border-radius: var(--border-radius); border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); }
    
    .calendar-wrapper {
        padding: 0;
        overflow: hidden;
        width: 100%;
    }

    .calendar-grid { 
        display: grid; 
        grid-template-columns: repeat(7, minmax(0, 1fr)); 
        background: var(--border-color); 
        gap: 1px; 
        width: 100%;
    }

    .weekday-header {
        background: var(--bg-main);
        color: var(--text-secondary);
        text-align: center;
        padding: 12px var(--spacing-sm);
        font-weight: 600;
        font-size: 0.85rem;
        text-transform: uppercase;
    }

    .calendar-cell {
        background: var(--card-bg);
        min-height: 120px;
        padding: var(--spacing-sm);
        display: flex;
        flex-direction: column;
        transition: var(--transition);
    }

    .calendar-cell.empty { background: #F8FAFC; }
    .calendar-cell.clickable { cursor: pointer; }
    .calendar-cell.clickable:hover { background: #F9FAFB; }

    .cell-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 6px;
    }

    .day-number { font-weight: 600; color: var(--text-secondary); font-size: 0.9rem; }
    
    .add-icon {
        font-size: 1.1rem;
        color: var(--primary-color);
        opacity: 0;
        transition: opacity 0.2s ease;
        font-weight: bold;
    }
    .calendar-cell.clickable:hover .add-icon { opacity: 0.6; }

    .event-container { 
        display: flex; 
        flex-direction: column; 
        gap: 4px; 
        overflow-y: auto; 
        max-height: 80px; 
    }

    .event-badge {
        background: rgba(30, 58, 138, 0.06);
        color: var(--primary-color);
        font-size: 0.75rem;
        padding: 3px 6px;
        border-radius: 3px;
        text-decoration: none;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        border-left: 3px solid var(--primary-color);
        font-weight: 500;
        transition: var(--transition);
    }
    .event-badge:hover { background: var(--primary-color); color: #FFFFFF; }

    @media (max-width: 768px) {
        .dashboard-heading { flex-direction: column; gap: var(--spacing-md); text-align: center; }
        .calendar-cell { min-height: 90px; padding: 4px; }
        .weekday-header { padding: 8px 2px; font-size: 0.75rem; }
        .event-badge { font-size: 0.7rem; padding: 2px 4px; }
    }
</style>