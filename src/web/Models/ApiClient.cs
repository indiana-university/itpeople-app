using System;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Blazored.SessionStorage;

namespace web
{
	public class ApiClient : HttpClient
	{
		private ISyncSessionStorageService StorageService { get; set;}
		private IConfiguration Configuration { get; set;}

		public ApiClient(ISyncSessionStorageService storageService, IConfiguration configuration)
		{
			StorageService = storageService;
			Configuration = configuration;

			// Set the BaseAddress
			this.BaseAddress = new Uri(Utils.Env(configuration, "API_URL", true));
			var userDetails = storageService.GetItem<AuthenticatedUser>("user");
			Console.WriteLine($"ApiClient userDetails: {userDetails}\n\tAccessToken: {userDetails?.AccessToken}\n\tUsenaem: {userDetails?.Username}");

			// If we have a JWT in Session Storage use it to add an Authorization header for API requestes.
			if(userDetails != null && string.IsNullOrWhiteSpace(userDetails.AccessToken) == false)
			{
				this.DefaultRequestHeaders.Add("Authorization", $"bearer {userDetails.AccessToken}");
			}
		}
	}
}