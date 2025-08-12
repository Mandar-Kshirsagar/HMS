namespace Hms.Application.Interfaces;

public interface IDashboardService
{
    Task<object> GetSummaryAsync();
    Task<IEnumerable<object>> GetMonthlyVisitsAsync(int year);
}


